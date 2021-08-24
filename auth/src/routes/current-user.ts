import express from "express";
import {CurrentUser} from "@msc-ticketing/common";


const router = express.Router()

router.get('/api/auth/currentuser', CurrentUser, (req, res) => {
    console.log("AUTH : Fetch Current User API Called")
    res.send({currentUser: req.currentUser || null})
})

export {router as currentUserRouter};
