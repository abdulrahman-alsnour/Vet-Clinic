'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

export default function AdminHotelCatsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [ownerSelected, setOwnerSelected] = useState(false);
  const [ownerPets, setOwnerPets] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [editingReservation, setEditingReservation] = useState<any | null>(null);
  const [checkingOutReservation, setCheckingOutReservation] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [extraServices, setExtraServices] = useState<Array<{reason: string, amount: number}>>([]);
  const [form, setForm] = useState({
    roomId: '',
    roomNumber: '',
    ownerName: '',
    ownerPhone: '',
    petName: '',
    checkIn: '',
    checkOut: '',
    notes: '',
  });

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      window.location.href = '/admin/login';
      return;
    }
    loadRooms();
    loadUsers();
    loadReservations();
  }, []);

  async function loadUsers() {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      console.error('Error loading users', e);
    }
  }

  async function loadReservations() {
    try {
      const res = await fetch('/api/hotel/reservations');
      const data = await res.json();
      setReservations(data.reservations || []);
    } catch (e) {
      console.error('Error loading reservations', e);
    }
  }

  async function loadOwnerPets(userId: string) {
    try {
      const res = await fetch(`/api/pets?userId=${userId}`);
      const data = await res.json();
      setOwnerPets(data.pets || []);
      if ((data.pets || []).length === 1) {
        setForm((prev) => ({ ...prev, petName: data.pets[0].name }));
      }
    } catch (e) {
      console.error('Error loading owner pets', e);
      setOwnerPets([]);
    }
  }

  const catRooms = useMemo(() => rooms.filter((r: any) => r.type === 'CAT').sort((a: any, b: any) => a.roomNumber - b.roomNumber), [rooms]);

  async function loadRooms() {
    try {
      setLoading(true);
      const res = await fetch('/api/hotel/rooms');
      const data = await res.json();
      if ((data.rooms || []).length === 0) {
        // initialize once if empty
        await fetch('/api/hotel/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ init: true }) });
        const res2 = await fetch('/api/hotel/rooms');
        const data2 = await res2.json();
        setRooms(data2.rooms || []);
      } else {
        setRooms(data.rooms || []);
      }
    } catch (e) {
      console.error('Error loading rooms', e);
    } finally {
      setLoading(false);
    }
  }

  function openBookModal(presetRoom?: any) {
    setForm({
      roomId: presetRoom?.id || '',
      roomNumber: presetRoom?.roomNumber?.toString() || '',
      ownerName: '',
      ownerPhone: '',
      petName: '',
      checkIn: '',
      checkOut: '',
      notes: '',
    });
    setOwnerSelected(false);
    setOwnerPets([]);
    setShowModal(true);
  }

  async function createReservation() {
    const room = catRooms.find((r: any) => r.id === form.roomId) || catRooms.find((r: any) => r.roomNumber?.toString() === form.roomNumber);
    if (!room) {
      alert('Please choose a room');
      return;
    }
    if (!form.ownerName || !form.ownerPhone || !form.petName) {
      alert('Please fill in owner name, phone number, and pet name');
      return;
    }
    if (!form.checkIn || !form.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    try {
      const res = await fetch('/api/hotel/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          ownerName: form.ownerName,
          ownerPhone: form.ownerPhone,
          petName: form.petName,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          notes: form.notes || null,
          pickup: (form as any).pickup || false,
          dropoff: (form as any).dropoff || false,
        }),
      });
      if (res.ok) {
        alert('Reservation created');
        setShowModal(false);
        await loadRooms();
        await loadReservations();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create reservation');
      }
    } catch (e) {
      console.error('Error creating reservation', e);
      alert('Error creating reservation');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-xl font-bold text-primary">Admin Dashboard</Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-700">Hotel • Cat Rooms</span>
            </div>
            <Link href="/admin/dashboard?tab=hotel" className="text-gray-700 hover:text-primary">Back</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Cat Rooms (1–10)</h1>
            <button
              onClick={() => openBookModal()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Book Reservation
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6,7,8,9,10].map((num) => {
            const room = catRooms.find((r:any)=>r.roomNumber === num);
            const status = room?.status || 'AVAILABLE';
            return (
              <div key={num} className="bg-white rounded-lg shadow-sm p-6 border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-600">Cat Room</p>
                    <h3 className="text-xl font-bold text-gray-900">#{num}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : status === 'OCCUPIED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{status}</span>
                </div>
              {(() => {
                const roomEntity = catRooms.find((r:any)=>r.roomNumber===num);
                const roomId = roomEntity?.id;
                const roomRes = reservations.filter((r:any)=>r.roomId===roomId && r.status !== 'cancelled' && r.status !== 'checked_out')
                  .sort((a:any,b:any)=> new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
                const current = roomRes[0];
                if (!current) return null;
                return (
                  <div className="mt-3 border rounded p-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-700"><span className="font-medium">Owner:</span> {current.user?.name || current.ownerName} • {current.user?.phone || current.ownerPhone}</p>
                        <p className="text-sm text-gray-700"><span className="font-medium">Pet:</span> {current.petName}</p>
                        <p className="text-sm text-gray-700"><span className="font-medium">Dates:</span> {new Date(current.checkIn).toLocaleDateString()} → {new Date(current.checkOut).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-600">{current.pickup ? 'Pickup' : ''}{current.pickup && current.dropoff ? ' • ' : ''}{current.dropoff ? 'Drop-off' : ''}</p>
                      </div>
                      <button
                        onClick={()=> setEditingReservation(current)}
                        className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={()=> {
                          const roomEntity = catRooms.find((r:any)=>r.roomNumber===num);
                          const roomId = roomEntity?.id;
                          const roomRes = reservations.filter((r:any)=>r.roomId===roomId && r.status !== 'cancelled')
                            .sort((a:any,b:any)=> new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
                          const latest = roomRes[0];
                          if (latest) {
                            setCheckingOutReservation(latest);
                            // Initialize extra services from reservation if they exist
                            if (latest.extraServices && Array.isArray(latest.extraServices)) {
                              setExtraServices(latest.extraServices);
                            } else {
                              setExtraServices([]);
                            }
                          }
                        }}
                        className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Check Out
                      </button>
                    </div>
                  </div>
                );
              })()}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => room ? openBookModal(room) : openBookModal({ roomNumber: num })}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Book Cat Room</h2>
              <button onClick={()=>setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Number *</label>
                  <select
                    value={form.roomNumber}
                    onChange={(e)=>{
                      const num = e.target.value;
                      const r = catRooms.find((rr:any)=>rr.roomNumber?.toString() === num);
                      setForm({ ...form, roomNumber: num, roomId: r?.id || '' });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select room</option>
                    {[1,2,3,4,5,6,7,8,9,10].map((n)=>{
                      const r = catRooms.find((rr:any)=>rr.roomNumber===n);
                      return <option key={n} value={n.toString()}>{`#${n} ${r?`(${r.status})`:''}`}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name *</label>
                  <input
                    type="text"
                    value={form.petName}
                    onChange={(e)=>setForm({ ...form, petName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter pet name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
                <input
                  type="text"
                  value={form.ownerName}
                  onChange={(e)=>setForm({ ...form, ownerName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Type name or phone to search, or enter new owner"
                />
                {form.ownerName && form.ownerName.length >= 2 && !ownerSelected && (
                  <div className="mt-1 max-h-48 overflow-y-auto border rounded-lg">
                    {users.filter((u:any)=>
                      (u.name && u.name.toLowerCase().includes(form.ownerName.toLowerCase())) ||
                      (u.phone && u.phone.includes(form.ownerName))
                    ).slice(0,5).map((u:any)=>(
                      <div key={u.id} className="px-3 py-2 hover:bg-gray-50 cursor-pointer" onClick={()=>{
                        setForm({ ...form, ownerName: u.name || u.email || '', ownerPhone: u.phone || '' });
                        setOwnerSelected(true);
                        loadOwnerPets(u.id);
                      }}>
                        <div className="font-medium">{u.name || u.email}</div>
                        {u.phone && <div className="text-sm text-gray-500">{u.phone}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {ownerPets && ownerPets.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Pet</label>
                  <select
                    value={form.petName}
                    onChange={(e)=>setForm({ ...form, petName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose pet</option>
                    {ownerPets.map((p:any)=> (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Phone *</label>
                <input
                  type="tel"
                  value={form.ownerPhone}
                  onChange={(e)=>setForm({ ...form, ownerPhone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in *</label>
                  <input
                    type="date"
                    value={form.checkIn}
                    onChange={(e)=>setForm({ ...form, checkIn: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out *</label>
                  <input
                    type="date"
                    value={form.checkOut}
                    onChange={(e)=>setForm({ ...form, checkOut: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={(form as any).pickup || false} onChange={(e)=>setForm({ ...(form as any), pickup: e.target.checked })} />
                  Pickup
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={(form as any).dropoff || false} onChange={(e)=>setForm({ ...(form as any), dropoff: e.target.checked })} />
                  Drop-off
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e)=>setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Any special instructions"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={()=>setShowModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={createReservation} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Create Reservation</button>
            </div>
          </div>
        </div>
      )}

      {editingReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Edit Reservation</h2>
              <button onClick={()=>setEditingReservation(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
                  <input
                    type="text"
                    defaultValue={editingReservation.ownerName}
                    onChange={(e)=> setEditingReservation({ ...editingReservation, ownerName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner Phone *</label>
                  <input
                    type="tel"
                    defaultValue={editingReservation.ownerPhone}
                    onChange={(e)=> setEditingReservation({ ...editingReservation, ownerPhone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name *</label>
                <input
                  type="text"
                  defaultValue={editingReservation.petName}
                  onChange={(e)=> setEditingReservation({ ...editingReservation, petName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in *</label>
                  <input
                    type="date"
                    defaultValue={new Date(editingReservation.checkIn).toISOString().split('T')[0]}
                    onChange={(e)=> setEditingReservation({ ...editingReservation, checkIn: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out *</label>
                  <input
                    type="date"
                    defaultValue={new Date(editingReservation.checkOut).toISOString().split('T')[0]}
                    onChange={(e)=> setEditingReservation({ ...editingReservation, checkOut: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={!!editingReservation.pickup} onChange={(e)=> setEditingReservation({ ...editingReservation, pickup: e.target.checked })} />
                  Pickup
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={!!editingReservation.dropoff} onChange={(e)=> setEditingReservation({ ...editingReservation, dropoff: e.target.checked })} />
                  Drop-off
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  defaultValue={editingReservation.status}
                  onChange={(e)=> setEditingReservation({ ...editingReservation, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="booked">Booked</option>
                  <option value="checked_in">Checked in</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={3}
                  defaultValue={editingReservation.notes || ''}
                  onChange={(e)=> setEditingReservation({ ...editingReservation, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={()=>setEditingReservation(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
              <button
                onClick={async ()=>{
                  if (!editingReservation.id) return;
                  const res = await fetch(`/api/hotel/reservations/${editingReservation.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      ownerName: editingReservation.ownerName,
                      ownerPhone: editingReservation.ownerPhone,
                      petName: editingReservation.petName,
                      checkIn: editingReservation.checkIn,
                      checkOut: editingReservation.checkOut,
                      notes: editingReservation.notes,
                      pickup: editingReservation.pickup,
                      dropoff: editingReservation.dropoff,
                      status: editingReservation.status,
                    }),
                  });
                  if (res.ok) {
                    alert('Reservation updated');
                    setEditingReservation(null);
                    await loadReservations();
                    await loadRooms();
                  } else {
                    const data = await res.json();
                    alert(data.error || 'Failed to update reservation');
                  }
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {checkingOutReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Check Out Reservation</h2>
              <button onClick={()=>setCheckingOutReservation(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700"><span className="font-medium">Room:</span> Cat Room #{checkingOutReservation.room?.roomNumber || 'N/A'}</p>
                <p className="text-sm text-gray-700"><span className="font-medium">Owner:</span> {checkingOutReservation.user?.name || checkingOutReservation.ownerName}</p>
                <p className="text-sm text-gray-700"><span className="font-medium">Pet:</span> {checkingOutReservation.petName}</p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Stay:</span> {new Date(checkingOutReservation.checkIn).toLocaleDateString()} → {new Date(checkingOutReservation.checkOut).toLocaleDateString()}
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Billing Summary</h3>
                
                {(()=> {
                  const checkIn = new Date(checkingOutReservation.checkIn);
                  const checkOut = new Date(checkingOutReservation.checkOut);
                  const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
                  const rate = 20;
                  const subtotal = nights * rate;
                  const pickupFee = checkingOutReservation.pickup ? 5 : 0;
                  const dropoffFee = checkingOutReservation.dropoff ? 5 : 0;
                  const extraTotal = extraServices.reduce((sum, s) => sum + (parseFloat(s.amount.toString()) || 0), 0);
                  const total = subtotal + pickupFee + dropoffFee + extraTotal;
                  
                  return (
                    <>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Room Rate ({nights} night{nights !== 1 ? 's' : ''} × {rate} JOD)</span>
                          <span className="font-medium">{subtotal.toFixed(2)} JOD</span>
                        </div>
                        {checkingOutReservation.pickup && (
                          <div className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Pickup Service</span>
                            <span className="font-medium">5.00 JOD</span>
                          </div>
                        )}
                        {checkingOutReservation.dropoff && (
                          <div className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">Drop-off Service</span>
                            <span className="font-medium">5.00 JOD</span>
                          </div>
                        )}
                        {extraServices.map((extra, idx)=> (
                          <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                            <span className="text-gray-600">{extra.reason}</span>
                            <span className="font-medium">{parseFloat(extra.amount.toString()).toFixed(2)} JOD</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-3 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">{total.toFixed(2)} JOD</span>
                      </div>
                      <input type="hidden" id="calculatedTotal" value={total} />
                    </>
                  );
                })()}
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Extra Service or Cost</label>
                <div className="space-y-2">
                  {extraServices.map((extra, idx)=> (
                    <div key={idx} className="flex gap-2 items-start">
                      <input
                        type="text"
                        value={extra.reason}
                        onChange={(e)=> {
                          const updated = [...extraServices];
                          updated[idx].reason = e.target.value;
                          setExtraServices(updated);
                        }}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., Bath, Grooming, etc."
                      />
                      <input
                        type="number"
                        value={extra.amount}
                        onChange={(e)=> {
                          const updated = [...extraServices];
                          updated[idx].amount = parseFloat(e.target.value) || 0;
                          setExtraServices(updated);
                        }}
                        className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Amount"
                        step="0.01"
                      />
                      <button
                        onClick={()=> setExtraServices(extraServices.filter((_, i)=> i !== idx))}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={()=> setExtraServices([...extraServices, { reason: '', amount: 0 }])}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    + Add Service
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                <select
                  id="paymentMethod"
                  defaultValue="cash"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="click">Click</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={()=>setCheckingOutReservation(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
              <button
                onClick={async ()=>{
                  if (!checkingOutReservation.id) return;
                  const checkIn = new Date(checkingOutReservation.checkIn);
                  const checkOut = new Date(checkingOutReservation.checkOut);
                  const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
                  const rate = 20;
                  const subtotal = nights * rate;
                  const pickupFee = checkingOutReservation.pickup ? 5 : 0;
                  const dropoffFee = checkingOutReservation.dropoff ? 5 : 0;
                  const extraTotal = extraServices.reduce((sum, s) => sum + (parseFloat(s.amount.toString()) || 0), 0);
                  const total = subtotal + pickupFee + dropoffFee + extraTotal;
                  const paymentMethod = (document.getElementById('paymentMethod') as HTMLSelectElement)?.value || 'cash';
                  
                  const res = await fetch(`/api/hotel/reservations/${checkingOutReservation.id}/checkout`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      totalNights: nights,
                      roomRate: rate,
                      subtotal: subtotal,
                      pickupFee: pickupFee,
                      dropoffFee: dropoffFee,
                      extraServices: extraServices.filter(e=>e.reason && e.amount > 0),
                      total: total,
                      paymentMethod: paymentMethod,
                    }),
                  });
                  if (res.ok) {
                    alert('Checkout completed successfully');
                    setCheckingOutReservation(null);
                    setExtraServices([]);
                    await loadReservations();
                    await loadRooms();
                  } else {
                    const data = await res.json();
                    alert(data.error || 'Failed to complete checkout');
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Complete Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


