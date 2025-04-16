import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Amadeus from 'amadeus';

const router = express.Router();


const mockHotels = [
    {
        hotel: {
            type: 'HOTEL',
            hotelId: 'MOCK_1',
            name: 'Grand Hotel Mock',
            rating: '4',
            cityCode: 'PAR',
            latitude: 48.8566,
            longitude: 2.3522,
            address: {
                lines: ['123 Mock Street'],
                postalCode: '75001',
                cityName: 'Paris',
                countryCode: 'FR'
            },
            amenities: ['WIFI', 'POOL', 'RESTAURANT'],
            description: {
                text: 'A luxurious mock hotel in the heart of Paris',
                lang: 'EN'
            }
        },
        available: true,
        offers: [
            {
                id: 'MOCK_OFFER_1',
                checkInDate: '2024-03-20',
                checkOutDate: '2024-03-25',
                room: {
                    type: 'DELUXE',
                    description: { text: 'Deluxe Room', lang: 'EN' }
                },
                guests: { adults: 2 },
                price: {
                    currency: 'EUR',
                    total: '1200.00',
                    variations: {
                        average: { base: '240.00' },
                        changes: []
                    }
                }
            }
        ]
    }
];

// Mock data for development
const mockCities = [
    {
        cityCode: 'PAR',
        name: 'Paris',
        countryCode: 'FR',
        countryName: 'France'
    },
    {
        cityCode: 'LON',
        name: 'London',
        countryCode: 'GB',
        countryName: 'United Kingdom'
    },
    {
        cityCode: 'NYC',
        name: 'New York',
        countryCode: 'US',
        countryName: 'United States'
    }
];



let amadeusType: typeof Amadeus;
try {
    if (!process.env.VITE_AMADEUS_CLIENT_ID || !process.env.VITE_AMADEUS_CLIENT_SECRET) {
        throw new Error('Missing Amadeus API credentials');
    }

    amadeusType = new Amadeus({
        clientId: process.env.VITE_AMADEUS_CLIENT_ID,
        clientSecret: process.env.VITE_AMADEUS_CLIENT_SECRET,
        hostname: 'test'
    });

    console.log('Amadeus client initialized successfully');
} catch (error) {
    console.error('Failed to initialize Amadeus client:', error);
    amadeusType = null as any;
}


// City search endpoint
router.get('/cities', authenticateToken, async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword || typeof keyword !== 'string' || keyword.length < 2) {
            return res.status(400).json({
                message: 'Search keyword must be at least 2 characters long'
            });
        }

        console.log('Searching cities with keyword:', keyword);

        // Use mock data if Amadeus is not initialized
        if (!amadeusType) {
            console.log('Using mock city data');
            const filteredCities = mockCities.filter(city =>
                city.name.toLowerCase().includes(keyword.toLowerCase()) ||
                city.countryName.toLowerCase().includes(keyword.toLowerCase())
            );
            return res.json({ data: filteredCities });
        }
        const response = await amadeusType.referenceData.locations.get({
            keyword,
            subType: 'CITY',
            'page[limit]': 10,
            view: 'LIGHT'
        });
        if (!response.data) {
            throw new Error('No data received from Amadeus API');
        }

        const cities = response.data.map((city: any) => ({
            cityCode: city.iataCode,
            name: city.name,
            countryCode: city.address.countryCode,
            countryName: city.address.countryName
        }));

        res.json({ data: cities });
    } catch (error: any) {
        console.error('Error searching cities:', error);

        // Return mock data if API call fails
        console.log('Falling back to mock city data');
        const filteredCities = mockCities.filter(city =>
            city.name.toLowerCase().includes((req.query.keyword as string).toLowerCase()) ||
            city.countryName.toLowerCase().includes((req.query.keyword as string).toLowerCase())
        );
        res.json({ data: filteredCities });
    }
});

/*// City search endpoint
router.get('/cities', authenticateToken, async (req, res) => {
    try {
        if (!amadeusType) {
            throw new Error('AMADEUS_NOT_INITIALIZED');
        }

        const { keyword } = req.query;

        if (!keyword || typeof keyword !== 'string' || keyword.length < 2) {
            return res.status(400).json({
                message: 'Search keyword must be at least 2 characters long'
            });
        }

        console.log('Searching cities with keyword:', keyword);

        const response = await amadeusType.referenceData.locations.get({
            keyword,
            subType: 'CITY',
            'page[limit]': 10,
            view: 'LIGHT'
        });

        if (!response.data) {
            throw new Error('No data received from Amadeus API');
        }

        const cities = response.data.map((city: any) => ({
            cityCode: city.iataCode,
            name: city.name,
            countryCode: city.address.countryCode,
            countryName: city.address.countryName
        }));

        res.json({ data: cities });
    } catch (error: any) {
        console.error('Error searching cities:', error);

        if (error.message === 'AMADEUS_NOT_INITIALIZED') {
            return res.status(500).json({
                message: 'City search service unavailable',
                details: 'API configuration error'
            });
        }

        if (error.response?.data?.errors) {
            return res.status(error.response.status || 500).json({
                message: 'Amadeus API Error',
                details: error.response.data.errors
            });
        }

        res.status(500).json({
            message: 'Error searching cities',
            details: error.message
        });
    }
});*/


// Flight search endpoint
router.post('/flights', authenticateToken, async (req, res) => {
    try {
        const {
            originLocationCode,
            destinationLocationCode,
            departureDate,
            returnDate,
            adults,
            travelClass,
            nonStop,
            currencyCode,
            max
        } = req.body;

        const response = await amadeusType.shopping.flightOffersSearch.get({
            originLocationCode,
            destinationLocationCode,
            departureDate,
            returnDate,
            adults,
            travelClass,
            nonStop,
            currencyCode,
            max
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error searching flights:', error);
        res.status(500).json({ message: 'Error searching flights' });
    }
});

router.get('/airports', authenticateToken, async (req, res) => {
    try {
        if (!amadeusType) {
            throw new Error('Amadeus client not initialized');
        }

        const { keyword } = req.query;

        if (!keyword || typeof keyword !== 'string' || keyword.length < 2) {
            return res.status(400).json({
                message: 'Search keyword must be at least 2 characters long'
            });
        }

        console.log('Searching airports with keyword:', keyword);

        const response = await amadeusType.referenceData.locations.get({
            keyword,
            subType: 'AIRPORT',
            'page[limit]': 10,
            view: 'LIGHT'
        });


        // Transform the response to match our interface
        const airports = response.data.map((airport: any) => ({
            iataCode: airport.iataCode,
            name: airport.name,
            cityName: airport.address.cityName,
            countryName: airport.address.countryName
        }));

        res.json({ data: airports });
    } catch (error: any) {
        console.error('Error searching airports:', {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            stack: error.stack
        });

        // Handle specific Amadeus API errors
        if (error.code === 'AMADEUS_NOT_INITIALIZED') {
            return res.status(500).json({
                message: 'Airport search service unavailable',
                details: 'API configuration error'
            });
        }

        // Handle other API errors
        if (error.response?.data?.errors) {
            return res.status(error.response.status || 500).json({
                message: 'Amadeus API Error',
                details: error.response.data.errors
            });
        }

        res.status(500).json({
            message: 'Error searching airports',
            details: error.message
        });
    }
});


// Airport search endpoint
router.get('/locations', authenticateToken, async (req, res) => {
    try {
        const { keyword } = req.query;
        const response = await amadeusType.referenceData.locations.get({
            keyword,
            subType: Amadeus.location.AIRPORT
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error searching locations:', error);
        res.status(500).json({ message: 'Error searching locations' });
    }
});

// Flight price endpoint
router.post('/flights/:offerId/price', authenticateToken, async (req, res) => {
    try {
        const { offerId } = req.params;
        const response = await amadeusType.shopping.flightOffers.pricing.post(
            JSON.stringify({
                data: {
                    type: 'flight-offers-pricing',
                    flightOffers: [{ id: offerId }]
                }
            })
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error getting flight price:', error);
        res.status(500).json({ message: 'Error getting flight price' });
    }
});

// Flight insights endpoint
router.get('/flights/insights', authenticateToken, async (req, res) => {
    try {
        const { originCode, destinationCode } = req.query;
        const response = await amadeusType.analytics.itineraryPriceMetrics.get({
            originIataCode: originCode,
            destinationIataCode: destinationCode,
            departureDate: '2024-03-01,2024-09-30'
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error getting flight insights:', error);
        res.status(500).json({ message: 'Error getting flight insights' });
    }
});
// Hotel search endpoint
router.post('/hotelsByCity', authenticateToken, async (req, res) => {
    try {
        const {
            cityCode,
            checkInDate,
            checkOutDate,
            adults,
            radius,
            radiusUnit,
            hotelName,
            amenities,
            ratings,
            priceRange
        } = req.body;

        // Validate required parameters
        if (!cityCode || !checkInDate || !checkOutDate) {
            return res.status(400).json({
                message: 'Missing required parameters',
                details: 'City code, check-in date, and check-out date are required'
            });
        }

        // Use mock data if Amadeus is not initialized
        if (!amadeusType) {
            console.log('Using mock hotel data');
            return res.json({ data: mockHotels });
        }

        console.log('Searching hotels with params:', {
            cityCode,
            checkInDate,
            checkOutDate,
            adults
        });

       /* const response = await amadeusType.shopping.hotelOffers.get({
            cityCode,
        });*/

        /*const response = amadeusType.referenceData.locations.hotel.get({
            keyword: 'PARI',
            subType: 'HOTEL_GDS'
        })*/

        const response = await amadeusType.referenceData.locations.hotels.byCity.get({
            cityCode: cityCode
        })



       /* const response =await amadeusType.shopping.hotelOffersSearch.get({
            hotelIds: 'RTPAR001',
            adults: '2'
        })*/

        console.log("Hello"+response);

        if (!response.data) {
            throw new Error('No data received from Amadeus API');
        }

        res.json({ data: response.data });
    } catch (error: any) {
        console.error('Error searching hotels:', error);

        // Return mock data if API call fails
        if (!amadeusType || error.message === 'AMADEUS_NOT_INITIALIZED') {
            console.log('Falling back to mock hotel data');
            return res.json({ data: mockHotels });
        }

        if (error.response?.data?.errors) {
            return res.status(error.response.status || 500).json({
                message: 'Amadeus API Error',
                details: error.response.data.errors
            });
        }

        res.status(500).json({
            message: 'Error searching hotels',
            details: error.message
        });
    }
});


router.post('/hotelsOfferByHotelId', authenticateToken, async (req, res) => {
    try {
        const {
            hotelId,
        } = req.body;

        console.log("Hotel ID"+hotelId)
        // Validate required parameters
        if (!hotelId) {
            return res.status(400).json({
                message: 'Missing required parameters',
                details: 'City code, check-in date, and check-out date are required'
            });
        }

        // Use mock data if Amadeus is not initialized
        if (!amadeusType) {
            console.log('Using mock hotel data');
            return res.json({ data: mockHotels });
        }

        console.log('Searching hotels with params for hotel id:', {
            hotelId
        });
/*
        const  response1=await amadeusType.client.get('/v3/shopping/hotel-offers?hotelIds=DTLAX280&adults=1');
        console.log("direct call "+response1);*/

         const response = await amadeusType.shopping.hotelOffersSearch.get({
             hotelIds: hotelId,
             adults: '2'
         })
         
         if(!response.data) {
             console.log("no data found Hotel ID"+hotelId);
         }




        res.json({ data: response.data });
    } catch (error: any) {
        console.error('Error searching hotels:', error);

        // Return mock data if API call fails
        if (!amadeusType || error.message === 'AMADEUS_NOT_INITIALIZED') {
            console.log('Falling back to mock hotel data');
            return res.json({ data: mockHotels });
        }

        if (error.response?.data?.errors) {
            return res.status(error.response.status || 500).json({
                message: 'Amadeus API Error',
                details: error.response.data.errors
            });
        }

        res.status(500).json({
            message: 'Error searching hotels',
            details: error.message
        });
    }
});

// Hotel offer endpoint
router.get('/hotels/:offerId', authenticateToken, async (req, res) => {
    try {
        if (!amadeusType) {
            throw new Error('AMADEUS_NOT_INITIALIZED');
        }

        const { offerId } = req.params;
        const response = await amadeusType.shopping.hotelOffer(offerId).get();

        if (!response.data) {
            throw new Error('No data received from Amadeus API');
        }

        res.json(response.data);
    } catch (error: any) {
        console.error('Error getting hotel offer:', error);

        if (error.message === 'AMADEUS_NOT_INITIALIZED') {
            return res.status(500).json({
                message: 'Hotel offer service unavailable',
                details: 'API configuration error'
            });
        }

        if (error.response?.data?.errors) {
            return res.status(error.response.status || 500).json({
                message: 'Amadeus API Error',
                details: error.response.data.errors
            });
        }

        res.status(500).json({
            message: 'Error getting hotel offer',
            details: error.message
        });
    }
});
export default router;