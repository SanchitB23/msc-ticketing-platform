import express from "express";

const router = express.Router()

router.get('/api/auth/currentuser', (req, res) => {
    res.send('Hi There')
})

export {router as currentUserRouter};
