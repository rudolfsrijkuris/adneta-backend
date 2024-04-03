import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./userModel.js";

const router = express.Router();

router.post("/login", async (request, response) => {
    User.findOne({ email: request.body.email })
    .then((user) => {
        bcrypt.compare(request.body.password, user.password)
        .then((passwordCheck) => {
            // check if password matches
            if(!passwordCheck) {
                return response.status(400).send({
                    message: "Passwords does not match",
                    error,
                });
            }

            // create a token
            const token = jwt.sign({
                userId: user._id,
                userEmail: user.email,
            },
            "ADNETA-CRAZY-RANDOM-TOKEN",
            { expiresIn: "24h" });

            // return success response
            response.status(200).send({
                message: "Login Successful",
                email: user.email,
                token,
            });
        })
        .catch((error) => {
            response.status(400).send({
                message: "Passwords does not match",
                error,
            });
        })
    })
    .catch((e) => {
        response.status(400).send({
            message: "Email not found",
            e,
        });
    });
});

export default router;