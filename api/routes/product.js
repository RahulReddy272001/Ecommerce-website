
const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndadmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAndadmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id",verifyTokenAndadmin, async(req,resp)=>{

   
try{
  const updatedProduct = await Product.findByIdAndUpdate(
req.params.id,
{
  $set: req.body,
},
{new: true}
  );
  resp.status(200).json(updatedProduct)
}catch(err){
resp.status(500).json(err);
}

});

//DELETE

router.delete("./id", verifyTokenAndadmin, async (req,resp)=>{

  try{
await Product.findByIdAndDelete(req.params.id)
  resp.status(200).json("Product has been deleted...")

  }catch(err){
   resp.status(500).json(err)
  }

})

 //GET PRODUCT
router.get("/find/:id",async (req,resp)=>{

  try{
const product=await Product.findById(req.params.id)

resp.status(200).json(product)

  }catch(err){
   resp.status(500).json(err)
  }

})

//GET ALL PRODUCTS
router.get("/",  async (req,resp)=>{
const qNew = req.query.new;
const qCategory= req.query.category;

  try{


    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    
  resp.status(200).json(products);

  }catch(err){
   resp.status(500).json(err);
  }

});

   

module.exports = router;
