const mongoose = require("mongoose");

const AccommodationsSchema = new mongoose.Schema(
  {
    // details here
    city: { type: String, required: true },
    hotelName: { type: String, required: true },
    hotelPrice: { type: Number, required: true },
    roomType: { type: String, required: true },
    hotelAddress: { type: String, required: true },
    tier: { type: String, required: true },
    imageOne: { type: String, required: true },
    imageTwo: { type: String, required: true },
  },
  { collection: "Hotels" }
);

module.exports = mongoose.model("Hotels", AccommodationsSchema);

/**


_id
6736d011ca37b0c43e2fa454
city
"Sapporo, Hokkaido, Japan"
hotelName
"Hotel Sosei Sapporo MGallery Collection"
hotelPrice
500
roomType
"Premium Room"
hotelAddress
"Hokkaido, Sapporo, Chuo-ku Kita 2-jo Higashi 3-chome Sapporo Factory N…"
tier
"Luxurious"
imageOne
"https://i.imgur.com/6JvkDJH.jpeg"
imageTwo
"https://i.imgur.com/zifEgkL.jpeg"

*/
