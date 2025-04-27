import { Router } from 'express';
import { 
  httpCreateAuthProvider, 
  httpGetAllAuthProviders, 
  httpGetAuthProviderById, 
  httpUpdateAuthProviderById, 
  httpDeleteAuthProviderById 
} from '../controllers/authprovider.controller';

const authProviderRouter = Router();

// Define routes
authProviderRouter.post('/', httpCreateAuthProvider);

authProviderRouter.get('/', httpGetAllAuthProviders);

authProviderRouter.get('/:id', httpGetAuthProviderById);

authProviderRouter.put('/:id', httpUpdateAuthProviderById);

authProviderRouter.delete('/:id', httpDeleteAuthProviderById);

export default authProviderRouter;
