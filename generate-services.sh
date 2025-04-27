#!/bin/bash

# Define file paths
SCHEMA_FILE="src/types/schema.ts"
MODELS_DIR="src/models"
CONTROLLERS_DIR="src/controllers"
ROUTERS_DIR="src/routes"

# Define OpenAI API details
API_URL="https://api.openai.com/v1/chat/completions"
MODEL="gpt-4o-mini"

# Ensure the API key is set
if [ -z "$OPENAI_API_KEY" ]; then
  echo "Error: OPENAI_API_KEY is not set."
  exit 1
fi

# Function to create folder if it doesn't exist
create_folder() {
    local folder_name=$1
    if [ ! -d "$folder_name" ]; then
        mkdir -p "$folder_name"
        echo "Created folder: $folder_name"
    else
        echo "Folder $folder_name already exists"
    fi
}

# Function to convert a string to lowercase and remove spaces
to_lowercase() {
    echo "$1" | tr '[:upper:]' '[:lower:]' | tr -d ' '
}

# Function to capitalize the first letter of a string
capitalize_first_letter() {
    echo "$(echo "$1" | awk '{print toupper(substr($0, 1, 1)) tolower(substr($0, 2))}')"
}

# Function to interact with OpenAI API and get content
generate_content_from_openai() {
    local content_type="$1"
    local user_content="$2"
    local service_name="$3"
    
    # Ensure user_content is a string and escape special characters
    local formatted_user_content=$user_content

    # Construct the prompt for OpenAI
    local prompt=""
    case "$content_type" in
        schema)
            prompt="Generate a TypeScript MongoDB schema for the given interface. Export the model as default. Import the types from '../../types/schema'. : $formatted_user_content"
            ;;
        model)
            prompt="Generate the TypeScript functions to perform CRUD operations (create, get, get by id, update and delete by id) for the following MongoDB schema, no need for request and response. Import the model as default from './$service_name.schema'.: $formatted_user_content"
            ;;
        controller)
            prompt="Generate the TypeScript Express controller functions for the given database CRUD functions. The function name should start with http . If you are importing the CRUD functions, do it from '../models/$service_name/$service_name.model'. If you are importing the model itself import it from '../models/$service_name/$service_name.schema' .: $formatted_user_content"
            ;;
        router)
            prompt="Generate a TypeScript Express router for the following controllers. Name the router based on the service. Export the router as default. Define routes as relative (Ex: get and post as /, get by id as /:id). Import the controllers from '../controllers/$service_name.controller': $formatted_user_content"
            ;;
        *)
            echo "Unknown content type: $content_type"
            return
            ;;
    esac

    
    # Make the API request and capture the response
    local response=$(curl -s "$API_URL" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      -d "{
        \"model\": \"$MODEL\",
        \"response_format\": { \"type\": \"json_object\" },
        \"messages\": [
          {
            \"role\": \"system\",
            \"content\": \"You are an expert TypeScript developer. You will respond in JSON. The output will look like this: { file: 'CODE'}. The key must allways be 'file'. Type errors as any\"
          },
          {
            \"role\": \"user\",
            \"content\": \"$prompt\"
          }
        ]
      }")
    
    # Check for errors in the response
    local http_status=$(echo "$response" | jq -r '.status')
    if [[ "$http_status" -ge 350 ]]; then
        echo "Error: API request failed with status $http_status"
        echo "Response: $response"
        return
    fi

    local content=$(echo "$response" | jq -r '.choices[0].message.content')
    if [[ -z "$content" ]]; then
        echo "Error: No content returned from API"
        echo "Response: $response"
        return
    fi
    
    # Output the content
    echo "$content" | jq -r '.file'
    # echo $prompt
}



# Function to process each schema group
process_schema_group() {
    local group_name="$1"
    local schema_content="$2"


    schema_content=$(echo "$schema_content" | sed 's/"/\\"/g')


    # Ensure that group_name and schema_content are strings
    if [[ -z "$group_name" || -z "$schema_content" ]]; then
        echo "Error: Group name or schema content is missing."
        return
    fi

    # Convert group name to lowercase for file naming, remove spaces
    local service_name=$(echo "$group_name" | tr '[:upper:]' '[:lower:]' | tr -d ' ')
    local service_folder="$MODELS_DIR/$service_name"

    # Ensure that service_name is not empty before proceeding
    if [ -z "$service_name" ]; then
        echo "Error: Service name is empty."
        return
    fi

    # Create folder in models directory
    create_folder "$service_folder"

    # Generate schema.ts file
    generate_content_from_openai "schema" "$schema_content" "$service_name" > "$service_folder/$service_name.schema.ts"

    # Read the content of schema.ts
    schema_file_content=$(get_content_from_file "$service_folder/$service_name.schema.ts")

    # Ensure schema_file_content is a string
    if [[ -z "$schema_file_content" ]]; then
        echo "Error: Schema file content is empty."
        return
    fi

    # Generate model.ts file using schema.ts content
    generate_content_from_openai "model" "$schema_file_content" "$service_name" > "$service_folder/$service_name.model.ts"

    # Read the content of model.ts
    model_file_content=$(get_content_from_file "$service_folder/$service_name.model.ts")

    # Ensure model_file_content is a string
    if [[ -z "$model_file_content" ]]; then
        echo "Error: Model file content is empty."
        return
    fi

    # Generate controller.ts file using model.ts content
    generate_content_from_openai "controller" "$model_file_content" "$service_name" > "$CONTROLLERS_DIR/$service_name.controller.ts"

    # Read the content of controller.ts
    controller_file_content=$(get_content_from_file "$CONTROLLERS_DIR/$service_name.controller.ts")

    # Ensure controller_file_content is a string
    if [[ -z "$controller_file_content" ]]; then
        echo "Error: Controller file content is empty."
        return
    fi

    # Generate router.ts file using controller.ts content
    generate_content_from_openai "router" "$controller_file_content" "$service_name" > "$ROUTERS_DIR/$service_name.router.ts"

    echo "Processed service: $group_name"
}

# Read the schema.ts file and separate services
parse_schemas() {
    local group_name=""
    local schema_group=""

    while IFS= read -r line; do
        # If the line starts with a comment (assuming service group is commented)
        if [[ $line =~ ^//\ (.*\ service) ]]; then
            # If there's an existing group, process it
            if [ -n "$schema_group" ]; then
                process_schema_group "$group_name" "$schema_group"
                schema_group=""
            fi

            # Extract the service group name from the comment and remove "service"
            group_name="${BASH_REMATCH[1]}"
            group_name="${group_name/service/}"

        else
            # Append the line to the schema group
            schema_group+="$line\n"
        fi
    done < "$SCHEMA_FILE"

    # Process the last group
    if [ -n "$schema_group" ]; then
        process_schema_group "$group_name" "$schema_group"
    fi
}

get_content_from_file() {
    local file_path="$1"   

    local content="" # Accumulated content for the group

    # Ensure file_path is provided and the file exists
    if [ -z "$file_path" ] || [ ! -f "$file_path" ]; then
        echo "Error: File not found or path is empty"
        return 1
    fi

    # Read the file line by line
    while IFS= read -r line || [ -n "$line" ]; do
        content+="$line\n"
    done < "$file_path"

    # Remove the last '\n' and return the content
    echo $content
}



# Main function
main() {
    # Create necessary directories if not present
    create_folder "$CONTROLLERS_DIR"
    create_folder "$ROUTERS_DIR"

    # Start parsing schemas
    parse_schemas

    echo "Script completed successfully."
}

# Run the main function
main
