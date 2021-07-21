import express from "express";
import {CurrentUser} from "../middlewares/current-user";

const router = express.Router()

router.get('/api/auth/currentuser', CurrentUser, (req, res) => {
    console.log("Fetch Current User API Called")
    res.send({currentUser: req.currentUser || null})
})

export {router as currentUserRouter};
