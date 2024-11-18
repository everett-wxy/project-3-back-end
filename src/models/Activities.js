const mongoose = require("mongoose");

const ActivitiesSchema = new mongoose.Schema(
  {
    // details here
    city: { type: String, required: true },
    activityName: { type: String, required: true },
    activityPrice: { type: Number, required: true },
    activityDescription: { type: String, required: true },
    activityLocation: { type: String, required: true },
    tier: { type: String, required: true },
    imageOne: { type: String, required: true },
  },
  { collection: "Activities" }
);

module.exports = mongoose.model("Activities", ActivitiesSchema);

/**


_id
6736d001ca37b0c43e2fa407
city
"Cairo, Egypt"
activityName
"Day Trip to Luxor From Cairo By Flight"
activityPrice
343
activityDescription
"Luxor has so much to see, feel, eat and buy so if you have time and wa…"
activityLocation
"14 Champolion Street Downtown, Cairo 4272135 Egypt"
tier
"Luxurious"
imageOne
"https://d3rr2gvhjw0wwy.cloudfront.net/uploads/activity_galleries/40291…"

*/
