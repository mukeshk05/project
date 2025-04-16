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
    hotelId?: string;
}

export interface HotelOffer {
    hotel: {
        type: string;
        hotelId: string;
        chainCode: string;
        dupeId: string;
        name: string;
        rating: string;
        cityCode: string;
        latitude: number;
        longitude: number;
        address: {
            lines: string[];
            postalCode: string;
            cityName: string;
            countryCode: string;
            stateCode?: string;
        };
        amenities: string[];
        media: Array<{
            uri: string;
            category: string;
        }>;
        description?: {
            text: string;
            lang: string;
        };
    };
    available: boolean;
    offers: Array<{
        id: string;
        checkInDate: string;
        checkOutDate: string;
        rateCode: string;
        rateFamilyEstimated?: {
            code: string;
            type: string;
        };
        room: {
            type: string;
            typeEstimated: {
                category: string;
                beds: number;
                bedType: string;
            };
            description: {
                text: string;
                lang: string;
            };
        };
        guests: {
            adults: number;
        };
        price: {
            currency: string;
            base: string;
            total: string;
            variations: {
                average: {
                    base: string;
                };
                changes: Array<{
                    startDate: string;
                    endDate: string;
                    base: string;
                }>;
            };
        };
        policies: {
            paymentType: string;
            cancellation: {
                deadline?: string;
                description?: {
                    text: string;
                    lang: string;
                };
            };
        };
    }>;
}


export interface HotelData{
        chainCode: string;
        iataCode: string;
        dupeId: string;
        name: string;
        hotelId: string;
        geoCode:{
            latitude: number;
            longitude: number;
        };
        address: {
            countryCode: string;
        };
        retailing:{
            sponsorship:{
                isSponsored: boolean;
            }
        }

}

export interface HotelByCityData{
    data:HotelData[];
}

export interface HotelSearchResponse {
    data: HotelOffer[];
}

export interface LocationSearchResponse {
    data: Array<{
        iataCode: string;
        name: string;
        cityName: string;
        countryName: string;
    }>;
}

export interface AirportSearchResponse {
    data: Airport[];
}

export interface Airport {
    iataCode: string;
    name: string;
    cityName: string;
    countryName: string;
}

export interface City {
    cityCode: string;
    name: string;
    countryCode: string;
    countryName: string;
}

export interface CitySearchResponse {
    data: City[];
}


export const searchFlights = async (params: FlightSearchParams) => {
    try {
        const response = await api.post('http://localhost:5000/api/search/flights', params);
        return response.data;
    } catch (error) {
        console.error('Error searching flights:', error);
        throw error;
    }
};

export const searchHotels = async (params: HotelSearchParams): Promise<HotelSearchResponse> => {
    try {
        const response = await api.post('http://localhost:5000/api/search/hotelsOfferByHotelId', params);
        return response.data;
    } catch (error) {
        console.error('Error searching hotels:', error);
        throw error;
    }
};

export const searchHotelsByCity = async (params: HotelSearchParams): Promise<HotelByCityData> => {
    try {
        const response = await api.post('http://localhost:5000/api/search/hotelsByCity', params);
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



export const searchAirports = async (keyword: string): Promise<AirportSearchResponse> => {
    try {
        const response = await api.get('http://localhost:5000/api/search/airports', {
            params: { keyword }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching airports:', error);
        throw error;
    }
};


export const searchCities = async (keyword: string): Promise<CitySearchResponse> => {
    try {
        const response = await api.get('http://localhost:5000/api/search/cities', {
            params: { keyword }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching cities:', error);
        throw error;
    }
};

export const searchAirports1 = async (keyword: string): Promise<LocationSearchResponse> => {
    try {
        const response = await api.get('http://localhost:5000/api/search/locations', {
            params: { keyword }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching airports:', error);
        throw error;
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
    searchAirports
};