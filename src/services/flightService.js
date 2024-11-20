require("dotenv").config();

const authUrl = "https://test.api.amadeus.com/v1/security/oauth2/token";
const baseUrlSearchQueries =
    "https://test.api.amadeus.com/v2/shopping/flight-offers?max=10&currencyCode=SGD&adults=1";
const originLocationCodeParameter = "&originLocationCode=";
const destinationCodeParameter = "&destinationLocationCode=";
const departureDateParameter = "&departureDate=";
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
    cabinClass
) => {
    const access_token = await getAccessToken();
    const url = `${baseUrlSearchQueries}${originLocationCodeParameter}${originLocationCode}${destinationCodeParameter}${destinationCode}${departureDateParameter}${departureDate}${cabinClassParameter}${cabinClass}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!res.ok) {
            let errorMessage = `Error ${res.status}: ${res.statusText || "Unknown error"}`;
            let errorDetails = null;

            try {
                // Attempt to parse the response body as JSON for detailed error info
                const errorData = await res.json();
                errorDetails = errorData;

                // Construct a better error message based on API response
                errorMessage = `Error ${res.status}: ${
                    errorData.message ||
                    errorData.error?.message ||
                    res.statusText ||
                    "Unknown error"
                }`;
            } catch (jsonError) {
                console.warn("Failed to parse error response JSON:", jsonError);
            }

            // Log detailed error information
            console.error("Request failed:", {
                url,
                status: res.status,
                statusText: res.statusText,
                errorDetails: errorDetails ? JSON.stringify(errorDetails, null, 2) : "No additional details",
            });

            throw new Error(errorMessage);
        }

        const { data, dictionaries } = await res.json();
        if (!data || data.length === 0) {
            throw new Error("No flight data available for the given query.");
        }

        return {data, dictionaries};
    } catch (err) {
        if (err.name === "FetchError" || err.message.includes("network")) {
            console.error("Network or connectivity issue:", err);
        } else {
            console.error("Error in getFlightData:", {
                message: err.message,
                stack: err.stack,
            });
        }

        throw new Error("Error fetching flight data: " + err.message);
    }
    
};


module.exports = { getFlightData };
