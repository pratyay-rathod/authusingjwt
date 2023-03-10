const jwt = require("jsonwebtoken");
const user = require("../Model/User");

module.exports.requireAuth = (req, res) => {

    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "user is secret", (error, decodedToken) => {
            if (error) {
                res.redirect("/login");
            }
            else{
                console.log(decodedToken);
                res.render('smoothies');
            }
        })
    }
    else {
        res.redirect("/login");
    }
}

module.exports.checkCurrentUser = (req,res,next) => {

    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "user is secret", async (error, decodedToken) => {
            if (error) {
                console.log(error.message)
                res.locals.user = null;
                next()
            }
            else{
                console.log(decodedToken);
                const User = await user.findById(decodedToken.id);
                res.locals.user = User;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

