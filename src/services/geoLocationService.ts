import { OpenAI } from 'openai';
import axios from 'axios';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  distance: number;
  rating: number;
  priceLevel: number;
  photos?: string[];
  openingHours?: {
    isOpen: boolean;
    periods: any[];
  };
  tags: string[];
}

interface WeatherData {
  current: {
    condition: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  forecast: Array<{
    date: Date;
    condition: string;
    temperature: {
      min: number;
      max: number;
    };
    icon: string;
  }>;
}

class GeoLocationService {
  private openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });

  async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }

      throw new Error('Unable to get address from coordinates');
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }

  async getNearbyPlaces(
    latitude: number,
    longitude: number,
    radius: number = 5000,
    type?: string
  ): Promise<NearbyPlace[]> {
    try {
      const params: any = {
        location: `${latitude},${longitude}`,
        radius,
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      };

      if (type) {
        params.type = type;
      }

      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        { params }
      );

      if (response.data.status !== 'OK') {
        throw new Error(`Places API error: ${response.data.status}`);
      }

      return response.data.results.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        type: place.types[0],
        location: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          address: place.vicinity,
        },
        distance: this.calculateDistance(
          latitude,
          longitude,
          place.geometry.location.lat,
          place.geometry.location.lng
        ),
        rating: place.rating || 0,
        priceLevel: place.price_level || 1,
        photos: place.photos?.map(
          (photo: any) =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        ),
        openingHours: place.opening_hours,
        tags: place.types,
      }));
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      throw error;
    }
  }

  async getWeather(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );

      return {
        current: {
          condition: response.data.current.weather[0].main,
          temperature: response.data.current.temp,
          humidity: response.data.current.humidity,
          windSpeed: response.data.current.wind_speed,
          icon: response.data.current.weather[0].icon,
        },
        forecast: response.data.daily.slice(0, 5).map((day: any) => ({
          date: new Date(day.dt * 1000),
          condition: day.weather[0].main,
          temperature: {
            min: day.temp.min,
            max: day.temp.max,
          },
          icon: day.weather[0].icon,
        })),
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  async getPersonalizedSuggestions(
    latitude: number,
    longitude: number,
    preferences: string[],
    weather?: WeatherData
  ): Promise<any[]> {
    try {
      const places = await this.getNearbyPlaces(latitude, longitude);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4.5-preview-2025-02-27",
        messages: [
          {
            role: "system",
            content: "You are a local travel expert. Analyze nearby places and provide personalized recommendations based on user preferences and current weather."
          },
          {
            role: "user",
            content: `Based on these nearby places: ${JSON.stringify(places)}, 
              current weather: ${JSON.stringify(weather)}, 
              and user preferences: ${preferences.join(', ')},
              provide personalized recommendations.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error getting personalized suggestions:', error);
      throw error;
    }
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return parseFloat(distance.toFixed(1));
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const geoLocationService = new GeoLocationService();