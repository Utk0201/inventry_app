const mongoose=require('mongoose');
const express=require('express');
const app=express();

//requiring method override
const methodOverride=require('method-override');

//importing files from product.js in models directry
const Product=require('./models/product');


mongoose.connect('mongodb://localhost:27017/farmApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('MONGO CONNECTED');
})
.catch((e)=>{
    console.log('MONGO Error!!');
    console.log(e);
})

app.use(express.urlencoded({extended:true}))
//using method override middleware
app.use(methodOverride('_method'));

const categories=['fruits','vegetables','dairy']

//deleting products
app.delete('/products/:id',async (req,res)=>{
    // res.send('you made it!');
    const {id}=req.params;
    const deletedProd= await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

//updating product
//in form,we can't directly make a put request
//so, we have to use method override
app.put('/products/:id',async(req,res)=>{
    const {id}=req.params; //shorter way of telling 
    //Below line includes old info also
    //so, we set new:true
    // const changedProd=Product.findByIdAndUpdate(id,req.body,{runValidators:true});
    const changedProd=await Product.findByIdAndUpdate(id,req.body,{runValidators:true,new: true});
    //findByIdAndUpdate doesn't run validation by default
    //so,we set it to true
    res.redirect(`/products/${changedProd._id}`)
    res.send('Put!!');
})

//first,we have to extract the product
app.get('/products/:id/edit',async (req,res)=>{
    const {id}=req.params;
    const product=await Product.findById(id);
    res.render('products/edit',{product,categories});
})

//we need 2 routes, one to show the form and
//other to submit 

//this one takes you to the forms
app.get('/products/new',(req,res)=>{
    res.render('products/new',{categories});
})

//this one fetches information from the form
//but this has to be parsed. So, we write line 19

app.post('/products',async (req,res)=>{
    const newPrd=new Product(req.body);
    await newPrd.save();  //This line takes time  so
    //await it
    console.log(newPrd);
    res.redirect(`/products/${newPrd._id}`);
})

//to look for unique products
app.get('/products/:id',async (req,res)=>{
    const {id}=req.params;
    //req.body also works fine
    const fnd=await Product.findById(id);
    console.log(fnd);
    // res.send('details page');
    res.render('products/show',{fnd});
})

// app.set('views',path.join(_dirname,'views'));
app.set('view engine','ejs');

// app.set('views','/products');

app.listen(3000,function(){
    console.log('App is listening on 3000');
})

app.get('/products', async (req,res)=>{
    const products=await Product.find({})
    // console.log(products)
    // res.send('All products r here!!');
    res.render('products/index.ejs',{products});
})