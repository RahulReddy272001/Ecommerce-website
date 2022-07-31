
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndadmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id",verifyTokenAndAuthorization, async(req,resp)=>{

   
try{
  const updatedCart = await Cart.findByIdAndUpdate(
req.params.id,
{
  $set: req.body,
},
{new: true}
  );
  resp.status(200).json(updatedCart)
}catch(err){
resp.status(500).json(err);
}

});

//DELETE

router.delete("./id", verifyTokenAndAuthorization, async (req,resp)=>{

  try{
await Cart.findByIdAndDelete(req.params.id)
  resp.status(200).json("Cart has been deleted...")

  }catch(err){
   resp.status(500).json(err)
  }

})

 //GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req,resp)=>{

  try{
const cart=await Cart.findOne({userId: req.params.userId})

resp.status(200).json(cart)

  }catch(err){
   resp.status(500).json(err)
  }

})

//GET ALL 

 router.get("/", verifyTokenAndadmin, async (req,resp)=>{
  try{

    const carts = await Cart.find();
    resp.status(200).json(carts)

  }catch(err){
  resp.status(500).json(err)
  }
 }
  )

module.exports = router;
