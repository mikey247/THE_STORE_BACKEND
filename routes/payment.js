const Payment = require("../models/Payments");
const User = require("../models/User");
const router = require("express").Router();
const request = require("request");
const _ = require("lodash");
const { response } = require("express");

const { initializePayment, verifyPayment } = require("../paystack")(request);

router.get("/", async (req, res) => {
  const payments = await Payment.find();
  try {
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/checkout", async (req, res) => {
  try {
    const form = {
      email: req.body.email,
      amount: req.body.amount * 100,
      full_name: req.body.full_name,
    };

    form.metadata = {
      full_name: form.full_name,
    };

    initializePayment(form, (error, body) => {
      if (error) {
        //handle errors
        console.log(error);
        return;
      }

      const response = JSON.parse(body);
      console.log(response);
      // return;
      return res.redirect(301, response.data.authorization_url);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/paystack/callback", (req, res) => {
  const ref = req.query.reference;
  // console.log("VERIFY", ref);

  verifyPayment(ref, async (error, body) => {
    if (error) {
      //handle errors appropriately
      console.log(error, "rrrrrrrrrrr");
      return res.redirect("/error");
    }

    const response = JSON.parse(body);

    // console.log(response.data, "responserrrrrrrrrrrrrrr");

    // const data = _.at(response.data, [
    //   "reference",
    //   "amount",
    //   "customer.email",
    //   "metadata.full_name",
    // ]);

    const data = {
      reference: response.data.reference,
      amount: response.data.amount,
      email: response.data.customer.email,
      full_name: response.data.metadata.full_name,
    };

    // console.log(data);

    const payer = await User.findOne({ email: data.email });

    const newPayment = {
      reference: data.reference,
      amount: data.amount / 100,
      payer,
    };

    const payment = new Payment(newPayment);
    payment
      .save()
      .then((payment) => {
        if (payment) {
          // res.redirect("/receipt/" + payment._id);
          // console.log(payment, "rrr");
        }
      })
      .catch((e) => {
        console.log(e);
        // res.redirect("/error");
      });
  });
});

module.exports = router;
