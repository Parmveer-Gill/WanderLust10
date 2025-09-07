const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String,
    }


    ,//as we will pass url of imzg
    price: Number,
    location: String,
    country: String,
    //creating array for reviews for individual listing
    reviews: [
        {
            type: Schema.Types.ObjectId,//review di oject id store krwali
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    /*
    GeoJSON is a way to store location (geographical) data in MongoDB, like coordinates of a place (latitude & longitude).
With Mongoose GeoJSON, you can store and query data based on location very easily.

--> Benefits of Using Mongoose GeoJSON
1.Store Exact Locations
You can save exact latitude and longitude of places.
Example: Store the location of a hotel, shop, or restaurant.

2.Easier Location-Based Searches
MongoDB has special queries for GeoJSON (like $near, $geoWithin) so you can quickly find:
Places near a user's location
Places inside a certain area (like a city boundary)
*/
    geometry: {//this came from mongoose geoJSON
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }

});

//this is a moongoose post middleware--which will be called when we deleted a listing , so as the reviews array related to that listing should also be deleted to maintain DB consistency
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }


})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;