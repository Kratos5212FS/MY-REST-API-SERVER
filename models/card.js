const mongoose = require("mongoose");
const Joi = require("joi");

const cardSchema = new mongoose.Schema({
  biName: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
  },
  bizDescription: {
    type: String,
    minlength: 2,
    maxlength: 400,
    required: true,
  },
  bizAddress: {
    type: String,
    minlength: 2,
    maxlength: 400,
    required: true,
  },
  bizPhone: {
    type: String,
    minlength: 9,
    maxlength: 10,
    required: true,
  },
  bizImage: {
    type: String,
    minlength: 11,
    maxlength: 1024,
    required: true,
  },
  bizNumber: {
    type: String,
    minlength: 3,
    maxlength: 99999999,
    required: true,
    unique: true,
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Card = mongoose.model("Card", cardSchema);

function validateCard(data) {
  const schema = Joi.object({
    bizName: Joi.String().min(2).max(255).required(),
    bizDescription: Joi.string().min(2).max(1024).required(),
    bizAddress: Joi.string().min(2).max(400).required(),
    bizPhone: Joi.string()
      .min(9)
      .max(10)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
    bizImage: Joi.string().min(11).max(1024),
  });
  return schema.validate(data);
}

async function generateBizNumber() {
  while (true) {
    let randomoNumber = _.random(1000, 999999);
    let card = await Card.findOne({ bizNumber: randomNumber });
    if (!card) return String(randomNumber);
  }
}

exports.validateCard = validateCard;
exports.Card = Card;
exports.generateBizNumber = generateBizNumber;
