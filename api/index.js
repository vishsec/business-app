import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js';
import Listing from './models/listing.model.js';
import path from 'path';

dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then ( () => {
    console.log('connected to MongoDB');
})
.catch((err) => {
    console.log(err);
});

const __dirname = path.resolve();

const app = express();


app.use(express.json());
app.use(cookieParser());


app.listen(3000, () =>  {
    console.log('server is running on port 3000');
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.use('*' , (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {               //next middleware for error handling 
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.post('/create-listing', (req, res) => {
    console.log('Request Body:', req.body); // Log the request body

    const newListing = new Listing(req.body);
    newListing.save()
        .then(listing => res.json(listing))
        .catch(err => {
            console.error('Save Error:', err); // Log the error
            res.status(400).json({ error: err.message });
        });
});





