const Joi = require("joi");
const {User} = require('../models/user');
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateSignIn(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send("Invalid user name or password");

  const validPassword = bcrypt.compare(req.body.password, user.password);
  if(!validPassword)
  return res.status(400).send("Invalid user name or password");
  res.json({token:user.generateAuthToken()});
});

function validateSignIn(data) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().ming(6).max(255).required(),
  });
  return schema.validate(data);
}

module.exports = router;
