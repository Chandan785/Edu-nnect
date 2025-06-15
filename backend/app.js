import express from 'express';

import cookieParser from 'cookie-parser';
import cors  from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}))

app.use(express.json({limit: '50mb'}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true ,lineLimit: '50mb'}));
app.use(express.static('public'));

// Import routes
import userRouter from './src/routes/user.routes.js';
//http://localhost:3000/api/v1/users/ragister

//route decleration
app.use('/api/v1/users', userRouter);

// teacher routes
import teacherRoutes from './src/routes/techer.routes.js';
app.use('/api/v1/teachers',teacherRoutes);


//Admin route for login logout etc
import adminRoutes from './src/routes/admin.routes.js';
app.use('/api/v1/admins',adminRoutes);
export {app};
