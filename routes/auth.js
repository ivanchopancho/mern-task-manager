import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTER 
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        //check if it already exists
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).send("Email already in use");
        
        //hash password
        const hashed = await bcrypt.hash(password, 10);

        //save user
        const user = await User.create({ email, password: hashed});

        res.json({ message: "User created", userId: user._id });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});



//LOGIN
router.post("/login", async (req,res) => {
    const { email, password } = req.body;

    try {
        //find user 
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send("Invalid credentials");

        // check password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).send("Invalid credentials");

        // create JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        );
    } catch(err) {
        console.log(err);
        res-status(500).send("Server error");
    }
});

export default router;