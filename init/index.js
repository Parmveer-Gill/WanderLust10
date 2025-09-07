//This conatins the logic for how we are gonna intialize the DB

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing  = require("../models/listing.js");


const MONGO_URL = 'mongodb://127.0.0.1:27017/WanderLust';

main()
.then(function(){
    console.log("CONNECTED TO DB")
})
.catch(function(err){
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDB = async function() {
    //Firstly delete all the earlier present data from DB
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj, owner : "68b937c2ff90bda365d12ae4"}));//this line says we are modifying the prev db by mapping an additonal property of OWNER by adding its id

    //Now insert
    await Listing.insertMany(initData.data)

    console.log("DATA WAS INTIALIZED");
}

initDB();