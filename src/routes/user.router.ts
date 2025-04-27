import express from 'express';
import { 
  httpCreateUser, 
  httpGetUsers, 
  httpGetUserById, 
  httpUpdateUserById, 
  httpDeleteUserById 
} from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/', httpCreateUser);
userRouter.get('/', httpGetUsers);
userRouter.get('/:id', httpGetUserById);
userRouter.put('/:id', httpUpdateUserById);
userRouter.delete('/:id', httpDeleteUserById);

export default userRouter;
