const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndadmin } = require("./verifyToken");

const router = require("express").Router();
//UPDATE 
router.put("/:id",verifyTokenAndAuthorization, async(req,resp)=>{
if (req.body.password){
  req.bodypassword= CryptoJS.AES.encrypt(
    req.body.password,
    process.env.PASS_SEC
  ).toString();
}
try{
  const updatedUser = await User.findByIdAndUpdate(
req.params.id,
{
  $set: req.body,
},
{new: true}
  );
  resp.status(200).json(updatedUser)
}catch(err){
resp.status(500).json(err);
}

});

//DELETE
 
router.delete("./id", verifyTokenAndAuthorization, async (req,resp)=>{

  try{
await User.findByIdAndDelete(req.params.id)
  resp.status(200).json("User has been deleted...")

  }catch(err){
   resp.status(500).json(err)
  }

})


//GET USER
router.get("/find/:id", verifyTokenAndadmin, async (req,resp)=>{

  try{
const user=await User.findById(req.params.id)
const {password, ...others}=user._doc;
  resp.status(200).json(others)

  }catch(err){
   resp.status(500).json(err)
  }

})


//GET ALL USERS
router.get("/", verifyTokenAndadmin, async (req,resp)=>{
const query = req.query.new;
  try{
const users =  query? 
await User.find().sort({ _id: -1}).limit(5)
: await User.find();
  resp.status(200).json(users);

  }catch(err){
   resp.status(500).json(err);
  }

});


// GET USER STARTS

router.get("/stats", verifyTokenAndadmin,async (req,resp)=>{
  const date = new Date();
  const lastYear= new Date(date.setFullYear(date.getFullYear() -1));

  try{

    const data = await User.aggregate([
      {$match:{createdAt: {$gte: lastYear}}},
      {
        $project: {
          month: {$month: "$createdAt"},
        },
      },
      {
        $group:{
          _id:"$month",
          total: {$sum: 1},
        }
      }
    ])
  resp.status(200).json(data)
  }catch(err){
 resp.status(500).json(err);
  }

})
module.exports=router