const dotenv = require("dotenv")
const router = require("express").Router();
dotenv.config({ path: './.env' });
// const stripe = require("stripe")(process.env.STRIPE_KEY);
const KEY = process.env.STRIPE_KEY
const stripe = require("stripe")(KEY);




router.post("/payment", (req, resp) => {

  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {

        resp.status(200).json({ msg: "working" });
      } else {
        resp.status(200).json(stripeRes);
      }
    }
  );

});

module.exports = router;