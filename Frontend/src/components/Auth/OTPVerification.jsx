// OTPVerification.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVerifyOtpMutation, useResendOtpMutation } from '@/redux/api/authApiSlice';
import { toast } from 'react-hot-toast';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const timerRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId;
  console.log('User ID from state:', userId); // Debugging log
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // Start or restart the countdown timer
  useEffect(() => {
    // If userId is not passed in state, redirect to login
    if (!userId) {
      navigate('/login');
      return;
    }

    // Clear any existing timer, then start a fresh one
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timerRef.current);
  }, [userId, navigate, countdown === 60]);

  const onChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val) && val.length <= 6) {
      setOtp(val);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await verifyOTP({ userId, otp }).unwrap();
      toast.success('OTP verified successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTPHelper = async () => {
    if (countdown > 0 || isResending) return;

    setLoading(true);
    setError('');
    try {
      await resendOtp({ userId }).unwrap();
      toast.success('OTP resent successfully!');
      setCountdown(60); // reset countdown
    } catch (err) {
      setError(err?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E9F1FA]">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-4">Verify Your Phone Number</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          We’ve sent a 6‑digit code to your phone. Enter it below.
        </p>

        {error && (
          <div className="bg-red-100 border-red-400 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={onChange}
            maxLength={6}
            placeholder="123456"
            className="w-full text-center border px-3 py-2 rounded focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading || isVerifying}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading || isVerifying ? 'Verifying…' : 'Verify OTP'}
          </button>
        </form>

        <button
          onClick={resendOTPHelper}
          disabled={countdown > 0 || isResending}
          className="mt-4 w-full text-center text-blue-600 disabled:text-gray-400"
        >
          {isResending
            ? 'Resending…'
            : countdown > 0
            ? `Resend OTP in ${countdown}s`
            : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
