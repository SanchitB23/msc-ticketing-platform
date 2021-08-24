import express from "express";

const router = express.Router()

router.post('/api/auth/signout', (req, res) => {
    console.log("AUTH : Signout API Called")
    req.session = null
    res.status(200).send({})
})

export {router as signoutRouter};
