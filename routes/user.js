const router = require("express").Router();
const functions = require("./verifyToken");
const CryptoJS = require("crypto-js");
const User = require("../models/User");

// Update user
router.put("/:id", functions.verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
  //
});

// Delete user
router.delete(
  "/:id",
  functions.verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("user has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//Get User
router.get("/find/:id", functions.verifyTokenAndAdmin, async (req, res) => {
  try {
    let query = User.findOne({ id: req.params.id }).populate({
      path: "payments",
    });

    // query = query.populate({ path: "payments" });

    const user = await query;

    // console.log(user.payments);

    const { password, payments, ...others } = user._doc;

    res.status(200).json({
      user,
      payments: user.payments,
    });
    //
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Get All Users
router.get("/find", functions.verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(1)
      : await User.find();

    res.status(200).json({
      users,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Get User stats
router.get("/stats", functions.verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
