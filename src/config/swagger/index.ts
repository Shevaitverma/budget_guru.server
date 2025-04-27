import { authenticationPaths } from "./routes/authentication";
import { userPaths } from "./routes/user";

export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "API Documentation of Metastart",
      version: "1.0.0",
    },
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["name", "email"],
          properties: {
            _id: {
              type: "string",
              description: "The unique identifier of the user",
              example: "60d0fe4f5311236168a109ca",
            },
            name: {
              type: "string",
              description: "The name of the user",
              example: "John",
            },
            email: {
              type: "string",
              description: "The email address of the user",
              example: "user@example.com",
            },
            dp: {
              type: "string",
              description: "The display picture URL of the user",
              example: "https://example.com/images/john.jpg",
            },
            password: {
              type: "string",
              description: "The password of the user",
              example: "securepassword123",
            },
            provider: {
              type: "object",
              properties: {
                provider: {
                  type: "string",
                  enum: ["email", "google"],
                  description: "The authentication provider of the user",
                  example: "email",
                },
              },
            },
            verified: {
              type: "boolean",
              description: "Indicates whether the user's email is verified",
              example: false,
            },
          },
        },
      },
    },
    paths: {
      ...authenticationPaths,
      ...userPaths,
    },
  },
  apis: ["src/routes/*.ts", "src/model/**/*.ts"],
};
