const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });




module.exports.index = async function (req, res) {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = function (req, res) {
    res.render("listings/new.ejs")
}

module.exports.showListing = async function (req, res) {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        //below is nested populating
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Requested Listing Does Not Exist");
        //je exist ni krdi bss listing ale page te vapasa ajo
        res.redirect("/listings");
    }
    else {
        res.render("listings/show.ejs", { listing });
        console.log(listing.owner)

    }

}

module.exports.createListing = async function (req, res) {
    /*
    [Forward geocoding] converts location text into geographic coordinates, turning 2 Lincoln Memorial Circle SW into -77.050,38.889.
    [Reverse geocoding] turns geographic coordinates into place names, turning -77.050, 38.889 into 2 Lincoln Memorial Circle SW. These location names can vary in specificity, from individual addresses to states and countries that contain the given coordinates.

    */

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    newListing.geometry = response.body.features[0].geometry;//set krte co-ordinates from mapbox

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Added!");//this is form of (key , value);--Note that flash ala mesg only 1 time aunda bss
    res.redirect("/listings");
}

module.exports.renderEditForm = async function (req, res) {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Requested Listing Does Not Exist");
        //je exist ni krdi bss listing ale page te vapasa ajo
        res.redirect("/listings");
    }
    else {
        let origImgUrl = listing.image.url;
        origImgUrl = origImgUrl.replace("/upload", "/upload/w_250")//this means the Original image displayed at edit page will be low and small in quality, because the owner of that listing just want to get an idea how my prev uploaded image looked like , DB load will decrease..this change in url is powered by CLOUDINARY
        res.render("listings/edit.ejs", { listing, origImgUrl });
    }

}
module.exports.updateListing = async function (req, res) {
    let { id } = req.params;
    let lis = await Listing.findByIdAndUpdate(id, { ...req.body.listing })

    if (typeof (req.file) !== "undefined") {//it means edit krnn de time  new image file upload hoi ta hii new image backend nu bhejni a
        let url = req.file.path;
        let filename = req.file.filename;
        lis.image = { url, filename };
        await lis.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);

}

module.exports.destroyListing = async function (req, res) {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");

}