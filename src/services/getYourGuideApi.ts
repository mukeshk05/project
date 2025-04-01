import axios from 'axios';
import queryString from 'query-string';

const BASE_URL = '/api/getyourguide';

const gygApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export interface ActivitySearchParams {
  q?: string;
  city?: string;
  country?: string;
  date?: string;
  participants?: number;
  currency?: string;
  limit?: number;
  offset?: number;
}

export interface Activity {
  id: string;
  title: string;
  abstract: string;
  description: string;
  duration: string;
  price: {
    amount: number;
    currency: string;
  };
  images: {
    original: string;
    thumbnail: string;
  }[];
  rating: {
    average: number;
    count: number;
  };
  categories: string[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  meetingPoint: {
    address: string;
    latitude: number;
    longitude: number;
  };
  availableDates: string[];
}

export const searchActivities = async (params: ActivitySearchParams) => {
  try {
    const queryParams = queryString.stringify(params);
    const response = await gygApi.get(`/activities/search?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error searching activities:', error);
    throw error;
  }
};

export const getActivityDetails = async (activityId: string) => {
  try {
    const response = await gygApi.get(`/activities/${activityId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching activity details:', error);
    throw error;
  }
};

export const getActivityAvailability = async (activityId: string, date: string) => {
  try {
    const response = await gygApi.get(`/activities/${activityId}/availability`, {
      params: { date },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching activity availability:', error);
    throw error;
  }
};

export const getDestinationActivities = async (cityId: string, params?: {
  date?: string;
  participants?: number;
  categories?: string[];
  limit?: number;
  offset?: number;
}) => {
  try {
    const queryParams = queryString.stringify(params);
    const response = await gygApi.get(`/destinations/${cityId}/activities?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching destination activities:', error);
    throw error;
  }
};

export default {
  searchActivities,
  getActivityDetails,
  getActivityAvailability,
  getDestinationActivities,
};