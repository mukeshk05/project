import React, { useState, useEffect } from 'react';
import { CreditCard, Trash2, Check, Plus, AlertCircle } from 'lucide-react';

interface PaymentMethod {
  _id: string;
  type: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

const PaymentMethods: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/payments/methods', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const data = await response.json();
      setPaymentMethods(data);
    } catch (error) {
      setError('Failed to load payment methods');
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payments/methods/${id}/default`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to set default payment method');
      }

      await fetchPaymentMethods();
    } catch (error) {
      setError('Failed to set default payment method');
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payments/methods/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment method');
      }

      await fetchPaymentMethods();
    } catch (error) {
      setError('Failed to delete payment method');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment Methods</h2>
        <button
          onClick={() => setShowAddCard(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add New Card
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {paymentMethods.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CreditCard size={48} className="mx-auto mb-4 text-gray-400" />
          <p>No payment methods added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method._id}
              className={`border rounded-lg p-4 flex items-center justify-between ${
                method.isDefault ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <CreditCard className="text-gray-600" size={24} />
                <div>
                  <p className="font-medium">
                    {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                  </p>
                </div>
                {method.isDefault && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <button
                    onClick={() => setDefaultPaymentMethod(method._id)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="Set as default"
                  >
                    <Check size={20} />
                  </button>
                )}
                <button
                  onClick={() => deletePaymentMethod(method._id)}
                  className="text-red-600 hover:text-red-800 p-2"
                  title="Delete payment method"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Card Modal would go here */}
    </div>
  );
};

export default PaymentMethods;