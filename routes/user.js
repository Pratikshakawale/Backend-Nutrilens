require('dotenv/config')
const express = require("express");
const bcrypt = require("bcryptjs")
const { body, validationResult } = require("express-validator");
const router = express.Router()
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
const saltRounds = 10;

const db = require("../db")

router.post("/",
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
    body("number", "Please enter valid number").isMobilePhone(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ errors: errors.array() });
        }
        try {
            const { name, password, email, number } = req.body;
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                try {
                    await db.query(
                        "INSERT INTO requested_users (name, number, email, password_hash) VALUES ($1, $2, $3, $4)",
                        [name, number, email, hash]
                    )
                    return res.status(200).json({ message: "request generated" });
                } catch (error) {
                    if (error.code === "23505") {
                        return res.status(409).json({ message: "Request already generated" })
                    }
                    return res.status(500).send("Internal Server Error")
                }
            });
        } catch (error) {
            return res.status(500).send("Internal Server Error")
        }
    })



module.exports = router;