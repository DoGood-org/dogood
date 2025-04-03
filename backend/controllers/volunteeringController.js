// C:\DoGood\backend\controllers\volunteeringController.js
const Volunteering = require("../models/Volunteering");

exports.getUserVolunteering = async (req, res) => {
  try {
    const items = await Volunteering.find({ user: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching volunteering records" });
  }
};

exports.addVolunteering = async (req, res) => {
  try {
    const newItem = new Volunteering({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Error creating volunteering record" });
  }
};
