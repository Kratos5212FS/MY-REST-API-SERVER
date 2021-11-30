const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validateUser, validateCards } = require("../models/user");
const { Card } = require("../models/card");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOneAndDelete({ email: req.body.email });
  if (user)
    return res.status(400).send("User with this email already registered");

  user = new User(
    _.pick(req.body, ["name", "email", "password", "biz", "cards"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["_id", "name", "email"]));
});

const getCards = async (cardsArray) => {
  let cards = await Card.find({ bizNumber: { $in: cardsArray } });
  return cards;
};

router.get("/cards", auth, async (req,res) => {
  if (!req.query.numbers)
  return res.status(400).send("Cards numbers are missing");
  let data = {};
  data.cards = req.query.numbers.split(",");

  const cards = await getCards(data.cards);
  res.send(cards);
});

router.patch("/cards", auth, async (req, res) => {
  const { error } = validateCards(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let cards = await getCards(req.body.cards);
  if (cards.length != req.body.cards.length)
  return res.status(400).send("Cards numbers don't match");

  let user = await User.findById(req.user._id);
  user.cards = req.body.cards;
  user.save()
  res.send(user);
});

module.exports = router;