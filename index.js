const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.js");
const authRouter = require("./routes/auth.js");
const productRouter = require("./routes/product.js");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order.js");
const paymentRouter = require("./routes/payment.js");
const cors = require("cors");

dotenv.config({ path: "./config.env" });

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("DB connection successful");
});

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5000",
      "http://checkout.paystack.com",
      "http://thee-store.netlify.app",
    ],
  })
);

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/carts", cartRouter);
app.use("/api/payment", paymentRouter);

app.listen(5000, () => {
  console.log("THE_STORE is running✅🚀");
});
