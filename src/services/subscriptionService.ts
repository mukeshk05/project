interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  pdfCredits: number;
  earlyAccess: boolean;
}

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Basic rewards', 'Standard support'],
    pdfCredits: 2,
    earlyAccess: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    features: [
      'Advanced rewards',
      'Priority support',
      'Unlimited PDF exports',
      'Early access to deals',
    ],
    pdfCredits: -1, // Unlimited
    earlyAccess: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 29.99,
    features: [
      'Team rewards',
      'Dedicated support',
      'Unlimited PDF exports',
      'Early access to deals',
      'Group management',
      'Analytics dashboard',
    ],
    pdfCredits: -1, // Unlimited
    earlyAccess: true,
  },
];

class SubscriptionService {
  async getCurrentTier(userId: string): Promise<SubscriptionTier> {
    try {
      const response = await fetch(`http://localhost:5000/api/subscriptions/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch subscription');
      const { tierId } = await response.json();
      return SUBSCRIPTION_TIERS.find(tier => tier.id === tierId) || SUBSCRIPTION_TIERS[0];
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return SUBSCRIPTION_TIERS[0]; // Return free tier on error
    }
  }

  async upgradeTier(userId: string, tierId: string): Promise<void> {
    try {
      const response = await fetch(`http://localhost:5000/api/subscriptions/${userId}/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ tierId }),
      });

      if (!response.ok) throw new Error('Failed to upgrade subscription');
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw error;
    }
  }

  async getRemainingCredits(userId: string): Promise<number> {
    try {
      const response = await fetch(`http://localhost:5000/api/subscriptions/${userId}/credits`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch credits');
      const { credits } = await response.json();
      return credits;
    } catch (error) {
      console.error('Error fetching credits:', error);
      return 0;
    }
  }
}

export const subscriptionService = new SubscriptionService();