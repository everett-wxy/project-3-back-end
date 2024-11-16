require("dotenv").config();

const authUrl = "https://test.api.amadeus.com/v1/security/oauth2/token";
const baseUrlSearchQueries =
    "https://test.api.amadeus.com/v2/shopping/flight-offers?max=5&currencyCode=SGD&adults=1";
const originLocationCodeParameter = "&originLocationCode=";
const destinationCodeParameter = "&destinationLocationCode=";
const departureDateParameter = "&departureDate=";
const returnDateParameter = "&returnDate=";
const cabinClassParameter = "&travelClass=";

const getAccessToken = async () => {
    try {
        const response = await fetch(authUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: process.env.AMADEUS_ID,
                client_secret: process.env.AMADEUS_SECRET,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `Auth Error ${response.status}: ${
                    errorData.error_description || response.statusText
                }`
            );
        }
        const data = await response.json();
        return data.access_token;
    } catch (err) {
        console.error("Error fetching access token: ", err);
        throw err;
    }
};

const getFlightData = async (
    originLocationCode,
    destinationCode,
    departureDate,
    returnDate,
    cabinClass
) => {
    const access_token = await getAccessToken();
    const url = `${baseUrlSearchQueries}${originLocationCodeParameter}${originLocationCode}${destinationCodeParameter}${destinationCode}${departureDateParameter}${departureDate}${returnDateParameter}${returnDate}${cabinClassParameter}${cabinClass}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                `Error ${res.status}: ${
                    errorData.error.message || res.statusText
                }`
            );
        }
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("error:", err);
    }
};

getFlightData("SIN", "BKK", "2025-01-01", "2025-01-07", "ECONOMY")
    .then((data) => console.log(data))
    .catch((err) => console.error("Error in getFlightData:", err));

// console.log("CLIENT_ID:", process.env.AMADEUS_ID);
// console.log("CLIENT_SECRET:", process.env.AMADEUS_SECRET);

module.exports = { getFlightData };
