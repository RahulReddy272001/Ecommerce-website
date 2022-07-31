
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndadmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndadmin, async (req, resp) => {


  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    resp.status(200).json(updatedOrder)
  } catch (err) {
    resp.status(500).json(err);
  }

});

//DELETE

router.delete("./id", verifyTokenAndadmin, async (req, resp) => {

  try {
    await Order.findByIdAndDelete(req.params.id)
    resp.status(200).json("Order has been deleted...")

  } catch (err) {
    resp.status(500).json(err)
  }

})

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, resp) => {

  try {
    const orders = await Order.find({ userId: req.params.userId })

    resp.status(200).json(orders)

  } catch (err) {
    resp.status(500).json(err)
  }

})

//GET ALL 

router.get("/", verifyTokenAndadmin, async (req, resp) => {
  try {

    const orders = await Order.find();
    resp.status(200).json(orders)

  } catch (err) {
    resp.status(500).json(err)
  }
}
)

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndadmin, async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([

      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
