import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  bookingId: {
    _id: string;
    destinationId: string;
    checkIn: string;
    checkOut: string;
  };
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/payments/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      const data = await response.json();
      setPayments(data);
    } catch (error) {
      setError('Failed to load payment history');
    } finally {
      setIsLoading(false);
    }
  };

  const requestRefund = async (paymentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      await fetchPayments();
    } catch (error) {
      setError('Failed to process refund');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {payments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <DollarSign size={48} className="mx-auto mb-4 text-gray-400" />
          <p>No payment history available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment._id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Payment #{payment._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    payment.status
                  )}`}
                >
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium">
                      {payment.currency.toUpperCase()} {payment.amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{payment.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Booking Dates</p>
                    <p className="font-medium">
                      {new Date(payment.bookingId.checkIn).toLocaleDateString()} -{' '}
                      {new Date(payment.bookingId.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {payment.status === 'completed' && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => requestRefund(payment._id)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <RefreshCw size={16} />
                    Request Refund
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;