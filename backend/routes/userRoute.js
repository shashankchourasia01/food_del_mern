// import express from 'express'
// import { loginUser,registerUser } from '../controllers/userController.js'

// const userRouter = express.Router()


// userRouter.post("/register",registerUser)
// userRouter.post("/login",loginUser)

// export default userRouter;

import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';

const userRouter = express.Router();

// Register user route
userRouter.post("/register", registerUser);

// Login user route
userRouter.post("/login", loginUser);

export default userRouter;
