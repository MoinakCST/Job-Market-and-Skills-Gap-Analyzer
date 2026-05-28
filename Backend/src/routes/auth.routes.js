const {Router} = require('express')
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const authRouter = Router()
/** 
 * @route POST
 * @description Register a new user
 * @access public
 * 
*/
authRouter.post("/register",authController.registerUserController)
/**
 * @routes POST/api/auth/login
 * @description login user with email and password
 *@access Public
 */
authRouter.post("/login",authController.loginUserController)

/**
 * @routes GET/api/auth/logout
 * @description clear cookie from client and add token to the blacklist
 * @acccess Public
 */
authRouter.get("/logout", authController.logoutUserController)

/**
 * @route GET/api/auth/get-me
 * @description get the current logged in user details
 * @access Private
 */

authRouter.get("/get-me", authMiddleware.authUser,authController.getMeController)


module.exports = authRouter