'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Profile form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: '',
    area: '',
    address: '',
  });

  // Jordanian Governorates and Areas
  const governorates = {
    'Amman Governorate': ['Amman', 'Sahab', 'Wadi Al-Seer', 'Jubeiha', 'Marj Al-Hamam', 'Sweileh', 'Abu Alanda', 'Al-Muwaqqar', 'Naour'],
    'Zarqa Governorate': ['Zarqa', 'Russeifa', 'Hashimiyah', 'Azraq'],
    'Irbid Governorate': ['Irbid', 'Ramtha', 'Bani Kinanah', 'Mazar Al-Shamali', 'Kafr Yuba', 'Taybeh'],
    'Balqa Governorate': ['Salt', 'Fuheis', 'Mahis', 'Ain Al-Basha', 'Deir Alla'],
    'Mafraq Governorate': ['Mafraq', 'Ruweished', 'Sabha', 'Umm Al-Jimal'],
    'Jerash Governorate': ['Jerash', 'Souf', 'Sakib'],
    'Ajloun Governorate': ['Ajloun', 'Kufranja', 'Anjara'],
    'Madaba Governorate': ['Madaba', 'Dhiban', 'Ma\'in'],
    'Karak Governorate': ['Karak', 'Qatraneh', 'Mazar Al-Janoubi', 'Mutah', 'Rabba'],
    'Tafilah Governorate': ['Tafilah', 'Busaira', 'Hasa'],
    'Ma\'an Governorate': ['Ma\'an', 'Petra (Wadi Musa)', 'Shoubak', 'Al-Hussainiyah'],
    'Aqaba Governorate': ['Aqaba', 'Quweira', 'Rahma'],
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/user');
      return;
    }
    
    const userData = JSON.parse(userStr);
    setUser(userData);
    
    // Initialize form data
    setFormData({
      name: userData.name || '',
      phone: userData.phone || '',
      governorate: userData.governorate || '',
      area: userData.area || '',
      address: userData.address || '',
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user data in database
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUserData = await response.json();
      
      // Update user data in localStorage
      const updatedUser = {
        ...user,
        ...updatedUserData.user,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      governorate: user?.governorate || '',
      area: user?.area || '',
      address: user?.address || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/user/dashboard"
              className="text-primary hover:underline flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {user?.email}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {user?.name || 'Not set'}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {user?.phone || 'Not set'}
                  </div>
                )}
              </div>

              {/* Governorate */}
              <div>
                <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-2">
                  Governorate
                </label>
                {isEditing ? (
                  <select
                    id="governorate"
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value, area: '' })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Governorate</option>
                    {Object.keys(governorates).map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {user?.governorate || 'Not set'}
                  </div>
                )}
              </div>

              {/* Area */}
              {isEditing ? (
                formData.governorate && (
                  <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                      Area
                    </label>
                    <select
                      id="area"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Area</option>
                      {governorates[formData.governorate as keyof typeof governorates]?.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              ) : (
                user?.governorate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area
                    </label>
                    <div className="text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {user?.area || 'Not set'}
                    </div>
                  </div>
                )
              )}

              {/* Street Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                {isEditing ? (
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    placeholder="Street name, building number, etc."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="text-gray-900 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px]">
                    {user?.address || 'Not set'}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="pt-4 border-t border-gray-200 flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
