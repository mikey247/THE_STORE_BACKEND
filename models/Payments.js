const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new mongoose.Schema(
  {
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Payment must belong to a user"],
    },
    amount: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      required: [true, "A reference must be provided"],
    },
  },
  {
    timestamps: true,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

paymentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "payer",
    select: "email",
  });

  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
