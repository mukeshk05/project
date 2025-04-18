import { Amadeus } from 'amadeus';

const amadeus = new Amadeus({
  clientId: import.meta.env.VITE_AMADEUS_CLIENT_ID,
  clientSecret: import.meta.env.VITE_AMADEUS_CLIENT_SECRET
});

interface Seat {
  number: string;
  type: string;
  available: boolean;
  features: string[];
  price?: {
    amount: number;
    currency: string;
  };
}

interface SeatMap {
  cabin: string;
  deck: number;
  seats: Seat[];
}

export const getSeatMap = async (flightNumber: string, date: string): Promise<SeatMap[]> => {
  try {
    const response = await amadeus.shopping.seatMaps.get({
      flightOrderId: flightNumber,
      date: date
    });

    return response.data.map((deck: any) => ({
      cabin: deck.cabin,
      deck: deck.deck,
      seats: deck.seats.map((seat: any) => ({
        number: seat.number,
        type: seat.characteristicsCodes[0],
        available: seat.available,
        features: seat.features,
        price: seat.price && {
          amount: seat.price.amount,
          currency: seat.price.currency
        }
      }))
    }));
  } catch (error) {
    console.error('Error fetching seat map:', error);
    
    // Return mock data for development
    return [
      {
        cabin: 'ECONOMY',
        deck: 1,
        seats: Array.from({ length: 30 }, (_, i) => ({
          number: `${Math.floor(i / 6) + 1}${String.fromCharCode(65 + (i % 6))}`,
          type: i % 8 === 0 ? 'EXIT' : 'STANDARD',
          available: Math.random() > 0.3,
          features: ['CHARGEABLE', 'WINDOW'],
          price: {
            amount: 25 + Math.floor(Math.random() * 50),
            currency: 'USD'
          }
        }))
      }
    ];
  }
};

export default {
  getSeatMap,
};