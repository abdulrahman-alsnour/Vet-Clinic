'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function UserDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [hotelReservations, setHotelReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/user');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);

      // Fetch user's orders, pets, and appointments
      fetchOrders(userData.id);
      fetchPets(userData.id);
      fetchAppointments(userData.id);
      fetchHotelReservations(userData.id);
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/user');
    }
  }, [router]);

  const fetchOrders = async (userId: string) => {
    try {
      // Fetch only user's orders with server-side filtering
      const response = await fetch(`/api/orders?userId=${userId}&limit=5`);
      const data = await response.json();
      
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async (userId: string) => {
    try {
      const response = await fetch(`/api/pets?userId=${userId}`);
      const data = await response.json();
      setPets(data.pets);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const fetchAppointments = async (userId: string) => {
    try {
      const response = await fetch(`/api/appointments?userId=${userId}&status=upcoming`);
      const data = await response.json();
      setAppointments(data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchHotelReservations = async (userId: string) => {
    try {
      const response = await fetch(`/api/hotel/reservations?userId=${userId}`);
      const data = await response.json();
      const reservations = data.reservations || [];
      const upcoming = reservations.filter((res: any) => 
        res.status !== 'checked_out' && res.status !== 'cancelled'
      );
      setHotelReservations(upcoming);
    } catch (error) {
      console.error('Error fetching hotel reservations:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || user?.email}!
            </h1>
            <p className="text-gray-600">Manage your orders, appointments, and profile</p>
          </div>

          {/* Five Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Orders Card */}
            <Link
              href="/user/orders"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900">{orders.length}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">My Orders</h3>
              <p className="text-sm text-gray-600">
                View and track your order history
              </p>
            </Link>

            {/* Appointments Card */}
            <Link
              href="/user/appointments"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900">{appointments.length}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Appointments</h3>
              <p className="text-sm text-gray-600">
                Schedule and manage vet visits
              </p>
            </Link>

            {/* Profile Card */}
            <Link
              href="/user/profile"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">My Profile</h3>
              <p className="text-sm text-gray-600">
                Update your personal information
              </p>
            </Link>

            {/* My Pets Card */}
            <Link
              href="/user/pets"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900">{pets.length}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">My Pets</h3>
              <p className="text-sm text-gray-600">
                Manage your pet&apos;s information
              </p>
            </Link>

            {/* Hotel Booking Card */}
            <Link
              href="/user/hotel"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900">{hotelReservations.length}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Pet Hotel</h3>
              <p className="text-sm text-gray-600">
                Book a room for your pet
              </p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
