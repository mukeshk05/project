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

export interface FlightSearchParams {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    travelClass?: string;
    nonStop?: boolean;
    currencyCode?: string;
    max?: number;
}

export interface HotelSearchParams {
    cityCode: string;
    checkInDate: string;
    checkOutDate: string;
    adults?: number;
    radius?: number;
    radiusUnit?: 'KM' | 'MILE';
    hotelName?: string;
    amenities?: string[];
    ratings?: string[];
    priceRange?: string;
}

export const searchFlights = async (params: FlightSearchParams) => {
    try {
        const response = await api.post('/flights', params);
        return response.data;
    } catch (error) {
        console.error('Error searching flights:', error);
        throw error;
    }
};

export const searchHotels = async (params: HotelSearchParams) => {
    try {
        const response = await api.post('/hotels', params);
        return response.data;
    } catch (error) {
        console.error('Error searching hotels:', error);
        throw error;
    }
};

export const getFlightPrice = async (offerId: string) => {
    try {
        const response = await api.post(`/flights/${offerId}/price`);
        return response.data;
    } catch (error) {
        console.error('Error getting flight price:', error);
        throw error;
    }
};

export const getHotelOffer = async (offerId: string) => {
    try {
        const response = await api.get(`/hotels/${offerId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting hotel offer:', error);
        throw error;
    }
};

export const searchLocations = async (keyword: string) => {
    try {
        const response = await api.get('/locations', { params: { keyword } });
        return response.data;
    } catch (error) {
        console.error('Error searching locations:', error);
        throw error;
    }
};

export const getFlightInsights = async (originCode: string, destinationCode: string) => {
    try {
        const response = await api.get('/flights/insights', {
            params: { originCode, destinationCode }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting flight insights:', error);
        throw error;
    }
};

export default {
    searchFlights,
    searchHotels,
    getFlightPrice,
    getHotelOffer,
    searchLocations,
    getFlightInsights
};