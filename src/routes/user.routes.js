const express = require('express')
const router = express.Router()
const authController = require('../controllers/user.controller.js')
const { verifyToken } = require('../middlewares/verifyJwtToken.js')

router.post( "/register", authController.registerUser )
router.post( "/login", authController.loginUser )

router.get('/profile' , verifyToken, authController.getUserProfile)




module.exports = router