import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {              // these are called middlewares
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password:hashedPassword });
    try{
    await newUser.save();
    res.status(201).json("New user created!");
    } catch(error){
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({ email });
        if(!validUser) return next(errorHandler(404, "user not found"));
        const validPassword = bcryptjs.compareSync(password, validUser.password); 
        // compare sync is used to compare hashed and plain ,bcryptjs is the package 
        if(!validPassword) return next(errorHandler(401, "invalid password"));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
         // we save these tokens in browser cookies, these help in authenticating the user in the browser 
         // jwt is a package which helps in generating tokens using sign and also hashing them with a secret key
         const {password : pass, ...rest } = validUser._doc;
         //this above step is done to make sure hashed pass isnt shown in json
         //let's save this token in a cookie
         res
         .cookie('access_token', token, { httpOnly:true })
         .status(200)
         .json(rest);
         //make it httpOnly so no third party application can access it 
    } 
    catch (error) {
        next(error); 
    }
};

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if(user){
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc; 
            res 
            .cookie ('access token', token,  { httpOnly:true })
            .status(200)
            .json(rest);

        } else{
            //we create a password during sign in as google wont provide a pass which can be later updated by the user
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); 
            // for 8 characters if 16 is needed we add  
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({ 
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) ,
                //if there is username Vishu Avar it should be converted to vishuavar with random numbers at the end 
                // eg: vishuavar3456 
                email:req.body.email, 
                password:hashedPassword,
                avatar: req.body.photo
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET ); 
            const { password: pass, ...rest}= newUser._doc;
            res .cookie('access token', token, { httpOnly:true }).status(200).json(rest);
        }
        
    } catch (error) {
        next(error);
    }
} 
