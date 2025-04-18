import axios from 'axios';
const api = axios.create({
    baseURL: '/api/search',
    headers: {
        'Content-Type': 'application/json',
    },
});
// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const searchFlights = async (params) => {
    try {
        const response = await api.post('http://localhost:5000/api/search/flights', params);
        return response.data;
    }
    catch (error) {
        console.error('Error searching flights:', error);
        throw error;
    }
};
export const searchHotels = async (params) => {
    try {
        const response = await api.post('http://localhost:5000/api/search/hotelsOfferByHotelId', params);
        return response.data;
    }
    catch (error) {
        console.error('Error searching hotels:', error);
        throw error;
    }
};
export const searchHotelsByCity = async (params) => {
    try {
        const response = await api.post('http://localhost:5000/api/search/hotelsByCity', params);
        return response.data;
    }
    catch (error) {
        console.error('Error searching hotels:', error);
        throw error;
    }
};
export const getFlightPrice = async (offerId) => {
    try {
        const response = await api.post(`/flights/${offerId}/price`);
        return response.data;
    }
    catch (error) {
        console.error('Error getting flight price:', error);
        throw error;
    }
};
export const getHotelOffer = async (offerId) => {
    try {
        const response = await api.get(`/hotels/${offerId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error getting hotel offer:', error);
        throw error;
    }
};
export const searchLocations = async (keyword) => {
    try {
        const response = await api.get('/locations', { params: { keyword } });
        return response.data;
    }
    catch (error) {
        console.error('Error searching locations:', error);
        throw error;
    }
};
export const getFlightInsights = async (originCode, destinationCode) => {
    try {
        const response = await api.get('/flights/insights', {
            params: { originCode, destinationCode }
        });
        return response.data;
    }
    catch (error) {
        console.error('Error getting flight insights:', error);
        throw error;
    }
};
export const searchAirports = async (keyword) => {
    try {
        const response = await api.get('http://localhost:5000/api/search/airports', {
            params: { keyword }
        });
        return response.data;
    }
    catch (error) {
        console.error('Error searching airports:', error);
        throw error;
    }
};
export const searchCities = async (keyword) => {
    try {
        const response = await api.get('http://localhost:5000/api/search/cities', {
            params: { keyword }
        });
        return response.data;
    }
    catch (error) {
        console.error('Error searching cities:', error);
        throw error;
    }
};
export const searchAirports1 = async (keyword) => {
    try {
        const response = await api.get('http://localhost:5000/api/search/locations', {
            params: { keyword }
        });
        return response.data;
    }
    catch (error) {
        console.error('Error searching airports:', error);
        throw error;
    }
};
export const getHotelRatings = async (hotelId) => {
    try {
        const response = await api.get(`/hotels/${hotelId}/ratings`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching hotel ratings:', error);
        // Return mock data for development
        return {
            overallRating: 4.5,
            sentimentScore: 0.85,
            categories: [
                { name: 'Cleanliness', rating: 4.7, reviews: 156 },
                { name: 'Service', rating: 4.6, reviews: 142 },
                { name: 'Location', rating: 4.8, reviews: 168 },
                { name: 'Value', rating: 4.3, reviews: 134 }
            ],
            reviews: [
                {
                    text: "Excellent location and outstanding service. The staff went above and beyond.",
                    rating: 5,
                    date: new Date().toISOString(),
                    sentiment: 'positive'
                },
                {
                    text: "Clean rooms and great amenities, but the breakfast could be better.",
                    rating: 4,
                    date: new Date(Date.now() - 86400000).toISOString(),
                    sentiment: 'neutral'
                }
            ]
        };
    }
};
export default {
    searchFlights,
    searchCities,
    searchHotels,
    searchHotelsByCity,
    getFlightPrice,
    getHotelOffer,
    searchLocations,
    getFlightInsights,
    searchAirports,
    getHotelRatings
};
