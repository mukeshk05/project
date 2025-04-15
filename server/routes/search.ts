import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Amadeus from 'amadeus';

const router = express.Router();

const amadeus = new Amadeus({
    clientId: process.env.VITE_AMADEUS_CLIENT_ID,
    clientSecret: process.env.VITE_AMADEUS_CLIENT_SECRET
});

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

        const response = await amadeus.shopping.flightOffersSearch.get({
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

// Hotel search endpoint
router.post('/hotels', authenticateToken, async (req, res) => {
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

        const response = await amadeus.shopping.hotelOffers.get({
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
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error searching hotels:', error);
        res.status(500).json({ message: 'Error searching hotels' });
    }
});

// Flight price endpoint
router.post('/flights/:offerId/price', authenticateToken, async (req, res) => {
    try {
        const { offerId } = req.params;
        const response = await amadeus.shopping.flightOffers.pricing.post(
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

// Hotel offer endpoint
router.get('/hotels/:offerId', authenticateToken, async (req, res) => {
    try {
        const { offerId } = req.params;
        const response = await amadeus.shopping.hotelOffer(offerId).get();
        res.json(response.data);
    } catch (error) {
        console.error('Error getting hotel offer:', error);
        res.status(500).json({ message: 'Error getting hotel offer' });
    }
});

// Location search endpoint
router.get('/locations', authenticateToken, async (req, res) => {
    try {
        const { keyword } = req.query;
        const response = await amadeus.referenceData.locations.get({
            keyword,
            subType: Amadeus.location.AIRPORT
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error searching locations:', error);
        res.status(500).json({ message: 'Error searching locations' });
    }
});

// Flight insights endpoint
router.get('/flights/insights', authenticateToken, async (req, res) => {
    try {
        const { originCode, destinationCode } = req.query;
        const response = await amadeus.analytics.itineraryPriceMetrics.get({
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

export default router;