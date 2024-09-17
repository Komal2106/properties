/*****************************************************************************
*  SEP420  – Assignment 4
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: _Mankomal Kaur Gandhara_ Student ID: __134553221__ Date: _7 August, 2024_
*
*****************************************************************************/ 



const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const CONNECTION_STRING = "mongodb+srv://dbUser:Gagandeep23@cluster0.ugzbage.mongodb.net/Assignment4?retryWrites=true&w=majority&appName=Cluster0"

const port = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const propertySchema = new mongoose.Schema({
    image: { type: String, required: true },
    address: { type: String, required: true },
    rent: { type: Number, required: true },
    type: { type: String, required: true },
    ownerPhone: { type: String, required: true }
});


const Property = mongoose.model('property_collection', propertySchema);



// Home route: Displays the list of properties
app.get('/', async (req, res) => {
    const properties = await Property.find();
    res.render("home.ejs", { properties });
   // console.log(properties);
});

app.get('/add',(req, res) => {
    res.render("add.ejs");
});


app.post('/add', async (req, res) => {
    console.log(req.body);
    const PropertyToAdd = new Property({
        image:req.body.H_image,
        address:req.body.H_address,
        rent:req.body.M_rent,
        type:req.body.P_type,
        ownerPhone:req.body.P_number
    })

    
    try {
        await PropertyToAdd.save();
        res.redirect("/");
    } catch (error) {
       // console.error("Error details:", error);
        res.status(500).send("Error adding property to the database");
    }
});


app.get('/update/:id', async (req, res) => {
    let property = await Property.findById(req.params.id)
    
    if (!property) {
        return res.send(`<h1>Error!</h1><p>Property not found for id = ${req.params.id}`)           
    }
    res.render("update.ejs", {properties: property});
});


app.post('/update/:id', async (req, res) => {
    const idKeyword = req.params.id.replace(":", "");
    console.log(idKeyword);
    try{
    await Property.findByIdAndUpdate(idKeyword, {
        image:req.body.H_image,
        address:req.body.H_address,
        rent:req.body.M_rent,
        type:req.body.P_type,
        ownerPhone:req.body.P_number
    });
    //console.log(Property);

    
        res.redirect("/");
    } catch (error) {
       console.error("Error details:", error);
        res.status(500).send("Error updating property to the database");
    }
});


app.get('/delete/:id', async (req, res) => {
    const idKeyword = req.params.id.replace(":", "");
    console.log(idKeyword);
    try{
    await Property.findByIdAndDelete(idKeyword);
    //console.log(Property);
    res.redirect("/");
    } catch (error) {
       console.error("Error details:", error);
        res.status(500).send("Error deleting property from the database");
    }
});



const connectDB = async () => {
    try {
      console.log("Attempting to connect to database")
      const conn = await mongoose.connect(CONNECTION_STRING);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error.message);    
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
    // after server starts, attempt to connect to database
    connectDB()
});