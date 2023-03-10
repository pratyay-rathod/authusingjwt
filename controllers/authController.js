const User = require("../Model/User");
const jwt = require("jsonwebtoken");

const handleError = (error) => {

  let err = { email: "", password: "" };

  if (error.code === 11000) {
    err.email = "Email Id is already exist Please try with another";
    return err
  }

  if(error.message === "Incorrect Email"){
    err.email = "This Email is not Registered Please Sign Up";
  }

  if(error.message === "Incorrect Password"){
    err.password = "Incorrect Password Please Try Again";
  }

  if (error.message.includes("User validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      err[properties.path] = properties.message;
    })
  }

  return err
}

const maxAge = 3  * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({id},"user is secret",{
      expiresIn: maxAge
  });
}

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await User.create({ email, password });
    const token = createToken(result._id);
    res.cookie("jwt",token,{httpOnly:true, maxAge:maxAge * 1000});
    res.status(201).json({result:result._id});
  }
  catch (error) {
    const errors = handleError(error);
    res.status(404).json({ errors });
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try{
      const user = await User.login(email,password);
      const token = createToken(user._id);
      res.cookie("jwt",token,{httpOnly:true, maxAge:maxAge * 1000});
      res.status(200).json({user:user._id});
    }
  catch(error){
    const errors = handleError(error);
    res.status(400).json({errors});
  } 
}

module.exports.logout_get = async (req,res) => {
    res.cookie("jwt","",{maxAge:1});
    res.redirect("/");
}