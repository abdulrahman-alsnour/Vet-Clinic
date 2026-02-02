'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice } from '@/lib/utils';

export default function UserHotelPage() {
  const [user, setUser] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    roomId: '',
    roomType: 'DOG',
    petId: '',
    checkIn: '',
    checkOut: '',
    pickup: false,
    dropoff: false,
    notes: '',
  });

  const [extraServices, setExtraServices] = useState<Array<string>>([]);
  const [showAddExtra, setShowAddExtra] = useState(false);
  const [newExtraReason, setNewExtraReason] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/user');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);
    fetchReservations(userData.id);
    fetchRooms();
    fetchPets(userData.id);
  }, [router]);

  const fetchReservations = async (userId: string) => {
    try {
      const response = await fetch(`/api/hotel/reservations?userId=${userId}`);
      const data = await response.json();
      setReservations(data.reservations || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/hotel/rooms');
      const data = await res.json();
      setRooms(data.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchPets = async (userId: string) => {
    try {
      const response = await fetch(`/api/pets?userId=${userId}`);
      const data = await response.json();
      setPets(data.pets || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const checkRoomAvailability = async (roomId: string, checkIn: string, checkOut: string) => {
    try {
      const res = await fetch('/api/hotel/reservations');
      const data = await res.json();
      const allReservations = data.reservations || [];
      
      const conflictingReservations = allReservations.filter((res: any) => {
        if (res.roomId !== roomId) return false;
        if (res.status === 'cancelled' || res.status === 'checked_out') return false;
        
        const resCheckIn = new Date(res.checkIn).getTime();
        const resCheckOut = new Date(res.checkOut).getTime();
        const reqCheckIn = new Date(checkIn).getTime();
        const reqCheckOut = new Date(checkOut).getTime();
        
        // Check for overlap
        return (reqCheckIn < resCheckOut && reqCheckOut > resCheckIn);
      });
      
      return conflictingReservations.length === 0;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  const calculateCost = () => {
    if (!form.checkIn || !form.checkOut || !form.roomId) return 0;
    
    const checkInDate = new Date(form.checkIn);
    const checkOutDate = new Date(form.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return 0;
    
    const room = rooms.find(r => r.id === form.roomId);
    if (!room) return 0;
    
    // Room rates (same as admin)
    const roomRate = 20; // JOD per night for all room types
    const subtotal = nights * roomRate;
    
    const pickupFee = form.pickup ? 5 : 0;
    const dropoffFee = form.dropoff ? 5 : 0;
    
    // Extra services amounts will be set by admin at checkout
    return subtotal + pickupFee + dropoffFee;
  };

  const calculateNights = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const checkInDate = new Date(form.checkIn);
    const checkOutDate = new Date(form.checkOut);
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleAddExtra = () => {
    if (!newExtraReason) return;
    setExtraServices([...extraServices, newExtraReason]);
    setNewExtraReason('');
    setShowAddExtra(false);
  };

  const handleRemoveExtra = (index: number) => {
    setExtraServices(extraServices.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.roomId || !form.petId || !form.checkIn || !form.checkOut) {
      alert('Please fill in all required fields');
      return;
    }

    const isAvailable = await checkRoomAvailability(form.roomId, form.checkIn, form.checkOut);
    if (!isAvailable) {
      alert('This room is not available for the selected dates. Please choose different dates or room.');
      return;
    }

    const selectedPet = pets.find(p => p.id === form.petId);
    if (!selectedPet) {
      alert('Please select a pet');
      return;
    }

    try {
      const response = await fetch('/api/hotel/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: form.roomId,
          userId: user.id,
          ownerName: user.name,
          ownerPhone: user.phone,
          petId: form.petId,
          petName: selectedPet.name,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          pickup: form.pickup,
          dropoff: form.dropoff,
          notes: form.notes || null,
          extraServices: extraServices.length > 0 ? extraServices.map(reason => ({ reason, amount: 0 })) : null,
        }),
      });

      if (response.ok) {
        alert('Reservation created successfully!');
        setShowBookingModal(false);
        setForm({
          roomId: '',
          roomType: 'DOG',
          petId: '',
          checkIn: '',
          checkOut: '',
          pickup: false,
          dropoff: false,
          notes: '',
        });
        setExtraServices([]);
        fetchReservations(user.id);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create reservation');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'checked_in':
        return 'bg-yellow-100 text-yellow-800';
      case 'checked_out':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const roomCounts = {
    DOG: rooms.filter(r => r.type === 'DOG').length,
    CAT: rooms.filter(r => r.type === 'CAT').length,
    BIRD: rooms.filter(r => r.type === 'BIRD').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const upcomingReservations = reservations.filter((res: any) => 
    res.status !== 'checked_out' && res.status !== 'cancelled'
  );
  const pastReservations = reservations.filter((res: any) => 
    res.status === 'checked_out' || res.status === 'cancelled'
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Link
              href="/user/dashboard"
              className="text-primary hover:text-primary/80 font-medium"
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Book Hotel Room
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pet Hotel Booking
            </h1>
            <p className="text-gray-600">Book a room for your pet or view your reservations</p>
          </div>

          {/* Room Availability Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dog Rooms</p>
                  <p className="text-2xl font-bold text-gray-900">{roomCounts.DOG} Available</p>
                </div>
                <span className="text-3xl">🐕</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cat Rooms</p>
                  <p className="text-2xl font-bold text-gray-900">{roomCounts.CAT} Available</p>
                </div>
                <span className="text-3xl">🐱</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bird Rooms</p>
                  <p className="text-2xl font-bold text-gray-900">{roomCounts.BIRD} Available</p>
                </div>
                <span className="text-3xl">🦅</span>
              </div>
            </div>
          </div>

          {/* Upcoming Reservations */}
          {upcomingReservations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Reservations</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingReservations.map((reservation: any) => (
                  <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {reservation.petName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {reservation.room?.type} Room #{reservation.room?.roomNumber}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                        {reservation.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-medium">{new Date(reservation.checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-medium">{new Date(reservation.checkOut).toLocaleDateString()}</span>
                      </div>
                      {reservation.pickup && (
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span className="text-gray-600">Pickup Service</span>
                        </div>
                      )}
                      {reservation.dropoff && (
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span className="text-gray-600">Drop-off Service</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Reservations */}
          {pastReservations.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Past Reservations</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {pastReservations.map((reservation: any) => (
                  <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {reservation.petName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {reservation.room?.type} Room #{reservation.room?.roomNumber}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                        {reservation.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-medium">{new Date(reservation.checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-medium">{new Date(reservation.checkOut).toLocaleDateString()}</span>
                      </div>
                      {reservation.total && (
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-bold text-green-600">{formatPrice(reservation.total)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {upcomingReservations.length === 0 && pastReservations.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">No hotel reservations yet</p>
              <button
                onClick={() => setShowBookingModal(true)}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Book Your First Room
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Book Hotel Room</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
                <select
                  value={form.roomType}
                  onChange={(e) => {
                    setForm({ ...form, roomType: e.target.value as 'DOG' | 'CAT' | 'BIRD', roomId: '' });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="DOG">Dog Room</option>
                  <option value="CAT">Cat Room</option>
                  <option value="BIRD">Bird Room</option>
                </select>
              </div>

              {/* Room Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Room *</label>
                <select
                  value={form.roomId}
                  onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select a room</option>
                  {rooms
                    .filter((room: any) => room.type === form.roomType)
                    .sort((a: any, b: any) => a.roomNumber - b.roomNumber)
                    .map((room: any) => (
                      <option key={room.id} value={room.id}>
                        Room {room.roomNumber} - {room.status}
                      </option>
                    ))}
                </select>
              </div>

              {/* Pet Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Pet *</label>
                <select
                  value={form.petId}
                  onChange={(e) => setForm({ ...form, petId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select a pet</option>
                  {pets.map((pet: any) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species} - {pet.breed})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date *</label>
                  <input
                    type="date"
                    value={form.checkIn}
                    onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date *</label>
                  <input
                    type="date"
                    value={form.checkOut}
                    onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                    min={form.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Services</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.pickup}
                      onChange={(e) => setForm({ ...form, pickup: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>Pickup Service (+5 JOD)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.dropoff}
                      onChange={(e) => setForm({ ...form, dropoff: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>Drop-off Service (+5 JOD)</span>
                  </label>
                </div>
              </div>

              {/* Extra Services */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Extra Services</label>
                  <button
                    type="button"
                    onClick={() => setShowAddExtra(true)}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    + Add Service
                  </button>
                </div>
                {extraServices.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {extraServices.map((extra, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{extra}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExtra(idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {showAddExtra && (
                  <div className="border rounded-lg p-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Service name (e.g., Bath)"
                      value={newExtraReason}
                      onChange={(e) => setNewExtraReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <p className="text-xs text-gray-500">Amount will be set by admin at checkout</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddExtra}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddExtra(false);
                          setNewExtraReason('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Any special instructions or requirements..."
                />
              </div>

              {/* Cost Estimate */}
              {form.checkIn && form.checkOut && form.roomId && calculateNights() > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Cost Estimate</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room ({calculateNights()} night{calculateNights() !== 1 ? 's' : ''} × 20 JOD):</span>
                      <span className="font-medium">{formatPrice(calculateNights() * 20)}</span>
                    </div>
                    {form.pickup && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup Service:</span>
                        <span className="font-medium">{formatPrice(5)}</span>
                      </div>
                    )}
                    {form.dropoff && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Drop-off Service:</span>
                        <span className="font-medium">{formatPrice(5)}</span>
                      </div>
                    )}
                    {extraServices.length > 0 && (
                      <div className="pt-2 border-t border-green-300">
                        <p className="text-xs text-gray-600 mb-1">Extra Services (amounts set at checkout):</p>
                        {extraServices.map((extra, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-gray-600">• {extra}</span>
                            <span className="text-gray-500">TBD</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-green-300">
                      <span className="font-bold text-gray-900">Base Total:</span>
                      <span className="font-bold text-green-600 text-lg">{formatPrice(calculateCost())}</span>
                    </div>
                    {extraServices.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        + Extra services amounts will be added at checkout
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Final amount will be calculated at checkout
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingModal(false);
                    setForm({
                      roomId: '',
                      roomType: 'DOG',
                      petId: '',
                      checkIn: '',
                      checkOut: '',
                      pickup: false,
                      dropoff: false,
                      notes: '',
                    });
                    setExtraServices([]);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

