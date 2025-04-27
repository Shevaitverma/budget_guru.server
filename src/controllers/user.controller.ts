import UserModel from '../models/user/user.schema';
import { createUser, getUsers, getUserById, updateUserById, deleteUserById } from '../models/user/user.model';

export const httpCreateUser = async (req: any, res: any) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const httpGetUsers = async (req: any, res: any) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

export const httpGetUserById = async (req: any, res: any) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

export const httpUpdateUserById = async (req: any, res: any) => {
  try {
    const updatedUser = await updateUserById(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const httpDeleteUserById = async (req: any, res: any) => {
  try {
    const deletedUser = await deleteUserById(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
