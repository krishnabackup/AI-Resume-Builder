import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from "../api/axios";
import images from '../assets'
import NavBar from '../components/NavBar'

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      const response = await axiosInstance.post(`/api/forgot-password`, {
        email,
      });
      console.log('Forgot password request successful:', response.data);
      alert('Password reset link has been sent to your email.');
      navigate('/login');
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to send password reset link. Please try again.');
      console.error(
        'Forgot password error:',
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      <NavBar />
      <div className="fixed inset-x-0 top-16 bottom-0 flex items-center justify-center w-full p-4 md:p-8 lg:p-10 bg-blue-950 overflow-hidden">


        <div className="flex w-full h-full mx-auto overflow-hidden bg-white rounded-lg shadow-lg">
          <div className="hidden w-1/2 lg:block">
            <img
              src={images.forgot || '/forgot.png'}
              alt="forgotpasswordpage"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-full p-8 lg:w-1/2">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-semibold text-center text-gray-800">
                Forgot Your Password?
              </h1>
              <p className="text-sm text-center text-gray-600">
                Enter your email to reset your password
              </p>
              <img src={images.logo || '/logo.png'} alt="Logo" className="w-32 my-2" />
            </div>
            <form className="mt-6">
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={handleForgotPassword}
              >
                Send Reset Link
              </button>
            </form>
            <p className="mt-8 text-sm text-center text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </p>
            <p className="mt-4 text-xs text-center text-gray-400">
              &copy; 2025 AI Resume Builder. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
