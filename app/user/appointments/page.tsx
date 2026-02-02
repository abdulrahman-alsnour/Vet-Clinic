'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function UserAppointmentsPage() {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pets, setPets] = useState<any[]>([]);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    petId: '',
    petName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: '',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/user');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);
    fetchAppointments(userData.id);
    fetchPets(userData.id);
  }, [router]);

  const fetchAppointments = async (userId: string) => {
    try {
      const response = await fetch(`/api/appointments?userId=${userId}`);
      const data = await response.json();
      setAppointments(data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pet = pets.find((p) => p.id === formData.petId);
    const appointmentData = {
      userId: user.id,
      petId: formData.petId || null,
      petName: pet ? pet.name : formData.petName,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      reason: formData.reason,
      notes: formData.notes || null,
    };

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        // Reset form and close modal
        setFormData({
          petId: '',
          petName: '',
          appointmentDate: '',
          appointmentTime: '',
          reason: '',
          notes: '',
        });
        setShowAddModal(false);
        fetchAppointments(user.id);
        alert('Appointment booked successfully!');
      } else {
        alert('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setFormData({
      petId: '',
      petName: '',
      appointmentDate: '',
      appointmentTime: '',
      reason: '',
      notes: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingAppointments = appointments.filter((apt) => apt.status === 'upcoming');
  const pastAppointments = appointments.filter((apt) => apt.status !== 'upcoming');

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
          <div className="mb-6 flex justify-between items-center">
            <Link
              href="/user/dashboard"
              className="text-primary hover:underline flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Dashboard
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Book Appointment
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Appointments</h1>

          {/* Upcoming Appointments */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Appointments ({upcomingAppointments.length})</h2>
            {upcomingAppointments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 text-lg mb-4">No upcoming appointments</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{appointment.petName || 'General Visit'}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })} at {appointment.appointmentTime}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Reason:</span> {appointment.reason}</p>
                      {appointment.notes && (
                        <p><span className="font-semibold">Notes:</span> {appointment.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Appointments */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Appointments ({pastAppointments.length})</h2>
            {pastAppointments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                No past appointments
              </div>
            ) : (
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{appointment.petName || 'General Visit'}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })} at {appointment.appointmentTime}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Reason:</span> {appointment.reason}</p>
                      {appointment.notes && (
                        <p><span className="font-semibold">Notes:</span> {appointment.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book New Appointment</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Pet Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Pet (Optional)
                  </label>
                  <select
                    value={formData.petId}
                    onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a pet</option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} ({pet.species})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">If you don&apos;t have a pet yet, leave this blank and provide the pet name below</p>
                </div>

                {/* Pet Name (if no pet selected) */}
                {!formData.petId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Name
                    </label>
                    <input
                      type="text"
                      value={formData.petName}
                      onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                      placeholder="e.g., Buddy, Max, or General Consultation"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}

                {/* Appointment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Appointment Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Time *
                  </label>
                  <select
                    required
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Time</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit *
                  </label>
                  <textarea
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                    placeholder="e.g., Annual checkup, vaccination, emergency, grooming, etc."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    placeholder="Any additional information you'd like to provide..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    Book Appointment
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
