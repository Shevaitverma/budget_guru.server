import AuthProviderModel from './authprovider.schema';

export const createAuthProvider = async (data: any): Promise<any> => {
  const authProvider = new AuthProviderModel(data);
  return await authProvider.save();
};

export const getAllAuthProviders = async (): Promise<any[]> => {
  return await AuthProviderModel.find();
};

export const getAuthProviderById = async (id: string): Promise<any | null> => {
  return await AuthProviderModel.findById(id);
};

export const updateAuthProviderById = async (id: string, data: any): Promise<any | null> => {
  return await AuthProviderModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteAuthProviderById = async (id: string): Promise<any | null> => {
  return await AuthProviderModel.findByIdAndDelete(id);
};
