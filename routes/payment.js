const Payment = require("../models/Payments");
const User = require("../models/User");
const router = require("express").Router();
const request = require("request");
const _ = require("lodash");

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

      response = JSON.parse(body);
      console.log(response);
      // return;
      res.redirect(response.data.authorization_url);
    });

    // const newPayment = await Payment.create(req.body);
    // res.status(200).json(newPayment);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/paystack/callback", (req, res) => {
  const ref = req.query.reference;

  verifyPayment(ref, async (error, body) => {
    if (error) {
      //handle errors appropriately
      console.log(error);
      return res.redirect("/error");
    }

    response = JSON.parse(body);

    const data = _.at(response.data, [
      "reference",
      "amount",
      "customer.email",
      "metadata.full_name",
    ]);

    [reference, amount, email, full_name] = data;

    const payer = await User.findOne({ email: email });

    newPayment = { reference, amount, payer };
    const payment = new Payment(newPayment);
    payment
      .save()
      .then((payment) => {
        if (payment) {
          // res.redirect("/receipt/" + payment._id);
          console.log(payment);
        }
      })
      .catch((e) => {
        console.log(e);
        // res.redirect("/error");
      });
  });
});

module.exports = router;
