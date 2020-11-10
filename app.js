require("dotenv").config();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({
    msg: "Simple stripe payment gateway",
  });
});

// It is strongly recommended that you use a product id and quantity to calculate the total amount, and process on the backend to avoid people manipulating the cost
// since we don't have a product db we let the client compute the total amount and pass it to our server.
app.post("/payments", async (req, res) => {
  const { total } = req.query;

  console.log(`DEBUG: Payment request received amounting to ${total}`);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    res.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
});

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});
