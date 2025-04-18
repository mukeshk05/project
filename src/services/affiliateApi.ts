import axios from 'axios';

const TRAVELPAYOUTS_API_KEY = import.meta.env.VITE_TRAVELPAYOUTS_API_KEY;
const SKYSCANNER_API_KEY = import.meta.env.VITE_SKYSCANNER_API_KEY;

interface FlightSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  currency?: string;
}

interface HotelSearchParams {
  cityCode: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  currency?: string;
}

export const searchFlightDeals = async (params: FlightSearchParams) => {
  try {
    const response = await axios.get('https://api.travelpayouts.com/v2/prices/latest', {
      params: {
        ...params,
        token: TRAVELPAYOUTS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching flight deals:', error);
    return getMockFlightDeals(params);
  }
};

export const searchHotelDeals = async (params: HotelSearchParams) => {
  try {
    const response = await axios.get('https://api.travelpayouts.com/v2/hotels/search', {
      params: {
        ...params,
        token: TRAVELPAYOUTS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching hotel deals:', error);
    return getMockHotelDeals(params);
  }
};

export const getFlexibleDates = async (params: FlightSearchParams) => {
  try {
    const response = await axios.get('https://api.travelpayouts.com/v2/prices/month-matrix', {
      params: {
        ...params,
        token: TRAVELPAYOUTS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting flexible dates:', error);
    return getMockFlexibleDates(params);
  }
};

// Mock data for development
const getMockFlightDeals = (params: FlightSearchParams) => ({
  data: [
    {
      origin: params.origin,
      destination: params.destination,
      price: 299,
      airline: 'Delta',
      departure_at: params.departDate,
      return_at: params.returnDate,
      transfers: 0,
      link: `https://www.skyscanner.com/transport/flights/${params.origin}/${params.destination}`,
    },
    {
      origin: params.origin,
      destination: params.destination,
      price: 349,
      airline: 'United',
      departure_at: params.departDate,
      return_at: params.returnDate,
      transfers: 1,
      link: `https://www.skyscanner.com/transport/flights/${params.origin}/${params.destination}`,
    },
  ],
});

const getMockHotelDeals = (params: HotelSearchParams) => ({
  data: [
    {
      hotel_id: '123',
      name: 'Grand Hotel',
      stars: 4,
      price: 199,
      city: params.cityCode,
      link: `https://www.booking.com/hotel/city/${params.cityCode}`,
    },
    {
      hotel_id: '456',
      name: 'Luxury Resort',
      stars: 5,
      price: 299,
      city: params.cityCode,
      link: `https://www.booking.com/hotel/city/${params.cityCode}`,
    },
  ],
});

const getMockFlexibleDates = (params: FlightSearchParams) => ({
  data: [
    {
      date: new Date(params.departDate),
      price: 299,
    },
    {
      date: new Date(new Date(params.departDate).getTime() + 86400000),
      price: 279,
    },
    {
      date: new Date(new Date(params.departDate).getTime() + 172800000),
      price: 319,
    },
  ],
});

export default {
  searchFlightDeals,
  searchHotelDeals,
  getFlexibleDates,
};