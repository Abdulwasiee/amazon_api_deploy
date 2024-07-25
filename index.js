const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post("/payment/create", async (req, res) => {
  const { total } = req.body;

  if (!total || isNaN(total) || total <= 0) {
    return res.status(400).json({
      message: "Total must be a valid number greater than 0",
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 4146;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
