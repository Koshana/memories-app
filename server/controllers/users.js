import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/user.js';

import { SECRET } from '../secrets.js';


export const signIn = async (req,res) => {
    const { email, password } = req.body;

    try {
        const existinguser = await User.findOne({ email });

        if (!existinguser) {
            res.status(404).json({ message : "User dosen't exist" })
        }

        const isPasswordCorrect = bcrypt.compare(password, existinguser.password);

        if (!isPasswordCorrect) {
            res.status(400).json({ message : "Invalid Credentials" })
        }

        const token = jwt.sign({ email : existinguser.email, id : existinguser._id }, SECRET, { expiresIn : '1h' });

        res.status(200).json({ 
            result : existinguser,
            token
        });
    } catch (error) {
        res.status(500).json({ message : "Something went wrong" });
    }
} 

export const signUp = async (req,res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    try {
        const existinguser = await User.findOne({ email });
        
        if (existinguser) {
            res.status(400).json({ message : "User already exist" })
        }

        if (password !== confirmPassword) {
            res.status(400).json({ message : "Password don't match " })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password : hashedPassword, name : `${firstName} ${lastName}` });

        const token = jwt.sign({ email : result.email, id : result._id }, SECRET, { expiresIn : '1h' });

        res.status(200).json({ 
            result : result,
            token
        });
    } catch (error) {
        res.status(500).json({ message : "Something went wrong" });
    }
}