require('dotenv/config')
const express = require("express");
const bcrypt = require("bcryptjs")
const { body, validationResult } = require("express-validator");
const router = express.Router()
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
const saltRounds = 10;
const  Users = require("../models/Users");
const connectToMongo = require('../db');

await connectToMongo()

const redirectAuth = (req, res, next) => {
    if (req["x-email"]) {
        res.status(307).end();
    } else {
        next();
    }
}

router.post("/signup", redirectAuth,
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ msg: errors.array()[0].msg });
        }
        try {
            const { name, password, email, number } = req.body;
            //changes
            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                const user = Users.create({name, email,number, password: hash})
                user.then(user => {
                    const authToken = jwt.sign(user.id, JWT_SECRET);
                    return res.status(200).json({ Authorization: authToken });
                }).catch((err) => {
                    res.json({msg: err})
                });

            });

           
        } catch (error) {
            return res.status(500).json({ msg: "Internal Server Error" })
        }
    })

    router.post("/signin", redirectAuth,
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({min: 1}),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ msg: errors.array()[0].msg });
        }
        const {email, password} = req.body;
        try {
            Users.findOne({email: email}, function (err, findUser) {
                if (err) {
                    console.log(err)
                    res.status(500).json({error: "Email or Password is wrong"});
                }
                else {
                    if (findUser) {
                        bcrypt.compare(password, findUser.password, function (err, result) {
                            if (result) {
                                const authToken = jwt.sign(findUser.id, JWT_SECRET);
                                return res.status(200).json({ Authorization: authToken });
                    }
                    else {
                        return res.status(401).json({ msg: "Email or Password is wrong" });
                    }
                        });
                    }
                    else {
                        return res.status(500).json({ msg: "email or password is wrong" })
                    }
                }
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: "Internal Server Error" })
        }
    }
)

module.exports = router;