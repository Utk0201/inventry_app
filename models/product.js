 const mongoose=require('mongoose');

//defining properties of our model
 const productSchema=new mongoose.Schema({
     name:{
         type: String,
         required: true
     },
     price:{
         type: Number,
         required: true,
         min: 0
     },
     category:{
         type: String,
         lowercase:true,
         enum: ['fruits','vegetables','dairy']
     }
 })

 //compiling our model
//  const Product=mongoose.model('Product');
//If we write above line, then compiler doesn't know the
//properties of Product
 const Product=mongoose.model('Product',productSchema);

module.exports=Product;