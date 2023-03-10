const { Router } = require("express");
const authContoller = require("../controllers/authController");

const router = Router();

router.get("/signup",authContoller.signup_get);
router.post("/signup",authContoller.signup_post);
router.get("/login",authContoller.login_get);
router.post("/login",authContoller.login_post);
router.get("/logout",authContoller.logout_get);

module.exports = router;