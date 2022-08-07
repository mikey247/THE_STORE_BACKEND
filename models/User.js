const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    password: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// schema.virtual("media", {
//   ref: "files",
//   localField: "mediaId",
//   foreignField: "id",
//   justOne: true,
// });

//VIRTUAL POPULATE
UserSchema.virtual("payments", {
  ref: "Payment",
  localField: "_id", // the _id is how the parent-tour is connected to the child-review
  foreignField: "payer", // field on the Payment Model
});

module.exports = mongoose.model("User", UserSchema);
