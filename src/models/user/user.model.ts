import UserModel from "./user.schema";

// Create a user
export const createUser = async (userData: any) => {
  const user = new UserModel(userData);
  return await user.save();
};

export const getUserByEmail = async (
  email: string,
  getPassword: boolean = false
) => {
  if (!getPassword) return await UserModel.findOne({ email }, { password: 0 });
  return await UserModel.findOne({ email });
};

// Get all users
export const getUsers = async () => {
  return await UserModel.find();
};

// Get user by ID
export const getUserById = async (userId: string) => {
  return await UserModel.findById(userId);
};

// Update user by ID
export const updateUserById = async (userId: string, updateData: any) => {
  return await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
};

// Delete user by ID
export const deleteUserById = async (userId: string) => {
  return await UserModel.findByIdAndDelete(userId);
};
