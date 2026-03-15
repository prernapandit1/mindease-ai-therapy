import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../App';

const API = 'http://localhost:8000';
const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'sb'; // 'sb' = sandbox test

export default function PayPalButton({ plan, amount, onSuccess }) {
  const { token, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/payment/create-order`,
        { plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.order_id;
    } catch (err) {
      toast.error('Failed to create order. Please try again.');
      setLoading(false);
      throw err;
    }
  };

  const onApprove = async (data) => {
    try {
      const res = await axios.post(
        `${API}/api/payment/capture-order`,
        { order_id: data.orderID, plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`🎉 Welcome to ${plan} plan!`);
      // Update user in localStorage
      const stored = localStorage.getItem('mindease_user');
      if (stored) {
        const user = JSON.parse(stored);
        user.plan = plan;
        localStorage.setItem('mindease_user', JSON.stringify(user));
        if (setUser) setUser(user);
      }
      if (onSuccess) onSuccess(plan);
    } catch (err) {
      toast.error('Payment capture failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const onError = (err) => {
    toast.error('Payment failed. Please try again.');
    setLoading(false);
    console.error('PayPal error:', err);
  };

  return (
    <div className="w-full">
      <PayPalScriptProvider options={{
        'client-id': PAYPAL_CLIENT_ID,
        currency: 'USD',
        intent: 'capture'
      }}>
        <PayPalButtons
          style={{ layout: 'vertical', color: 'gold', shape: 'pill', label: 'pay', height: 45 }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          disabled={loading}
        />
      </PayPalScriptProvider>
      {loading && (
        <p className="text-center text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          Processing payment...
        </p>
      )}
    </div>
  );
}
