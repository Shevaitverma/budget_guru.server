import { Request, Response } from 'express';
import { createAuthProvider, getAllAuthProviders, getAuthProviderById, updateAuthProviderById, deleteAuthProviderById } from '../models/authprovider/authprovider.model';

export const httpCreateAuthProvider = async (req: Request, res: Response): Promise<void> => {
  try {
    const authProvider = await createAuthProvider(req.body);
    res.status(201).json(authProvider);
  } catch (error) {
    res.status(500).json({ error: 'Error creating auth provider' });
  }
};

export const httpGetAllAuthProviders = async (req: Request, res: Response): Promise<void> => {
  try {
    const authProviders = await getAllAuthProviders();
    res.status(200).json(authProviders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching auth providers' });
  }
};

export const httpGetAuthProviderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const authProvider = await getAuthProviderById(id);
    if (authProvider) {
      res.status(200).json(authProvider);
    } else {
      res.status(404).json({ error: 'Auth provider not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching auth provider' });
  }
};

export const httpUpdateAuthProviderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const updatedAuthProvider = await updateAuthProviderById(id, req.body);
    if (updatedAuthProvider) {
      res.status(200).json(updatedAuthProvider);
    } else {
      res.status(404).json({ error: 'Auth provider not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating auth provider' });
  }
};

export const httpDeleteAuthProviderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const deletedAuthProvider = await deleteAuthProviderById(id);
    if (deletedAuthProvider) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Auth provider not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting auth provider' });
  }
};
