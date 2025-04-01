import axios from 'axios';
import queryString from 'query-string';

const BASE_URL = '/api/viator';

const viatorApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export interface DestinationSearchParams {
  query?: string;
  startDate?: string;
  endDate?: string;
  count?: number;
  currencyCode?: string;
}

export interface Destination {
  destinationId: string;
  name: string;
  destinationType: string;
  latitude: number;
  longitude: number;
  parentId: string;
  thumbnailUrl?: string;
  attractionCount: number;
}

export interface Product {
  productId: string;
  title: string;
  description: string;
  duration: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  images: {
    url: string;
    caption: string;
  }[];
  rating: number;
  reviewCount: number;
}

export const searchDestinations = async (params: DestinationSearchParams) => {
  try {
    const queryParams = queryString.stringify(params);
    const response = await viatorApi.get(`/destinations/search?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error searching destinations:', error);
    throw error;
  }
};

export const getDestinationDetails = async (destinationId: string) => {
  try {
    const response = await viatorApi.get(`/destinations/${destinationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching destination details:', error);
    throw error;
  }
};

export const getDestinationProducts = async (destinationId: string, params?: {
  startDate?: string;
  endDate?: string;
  count?: number;
  currencyCode?: string;
}) => {
  try {
    const queryParams = queryString.stringify(params);
    const response = await viatorApi.get(`/destinations/${destinationId}/products?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching destination products:', error);
    throw error;
  }
};

export const getProductDetails = async (productId: string) => {
  try {
    const response = await viatorApi.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const getProductAvailability = async (productId: string, params: {
  startDate: string;
  endDate: string;
}) => {
  try {
    const queryParams = queryString.stringify(params);
    const response = await viatorApi.get(`/products/${productId}/availability?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product availability:', error);
    throw error;
  }
};

export default {
  searchDestinations,
  getDestinationDetails,
  getDestinationProducts,
  getProductDetails,
  getProductAvailability,
};