const express = require("express");
const _ = require("lodash");
const { Card, validateCard, generateBizNumber } = require("../models/card");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/:id", auth, async (req, res) => {
  let card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
  if (!card)
    return res.status(404).send("The Card with the given id wasn't found");
  res.send(card);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let card = await Card.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user._id },
    req.body
  );
  if (!card)
    return res.status(400).send("The CARD WITH THE GIVEN ID WASN'T FOUND");
  card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
  res.send(card);
});

router.delete("/:id", auth, async (req, res) => {
  const card = await Card.findOneAndDelete({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card)
    return res.status(404).send("The Card with the given ID wasn't found");
  res.send(card);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  if (!req.user.biz)
    return res.status(400).send("You are not allowed to post a new card");

  let card = new Card({
    bizName: req.body.bizName,
    bizDescription: req.body.bizDescription,
    bizAddress: req.body.bizAddress,
    bizPhone: req.body.bizPhone,
    bizImage: req.body.bizImage
      ? req.body.bizImage
      : "http://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    bizNumber: await generateBizNumber(),
    user_id: req.user._id,
  });
  let post = await card.save();
  res.send(post);
});

module.exports = router;
