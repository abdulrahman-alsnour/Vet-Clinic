'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: string;
  deliveryMethod: string;
  paymentMethod: string;
  createdAt: string;
  orderItems: {
    product: {
      name: string;
      image: string;
    };
    quantity: number;
    price: number;
  }[];
}

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  governorate: string | null;
  area: string | null;
  address: string | null;
  createdAt: string;
  petsCount?: number;
  ordersCount?: number;
  appointmentsCount?: number;
  pets?: any[];
  orders?: any[];
  appointments?: any[];
}

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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics' | 'owners' | 'appointments' | 'hotel'>('products');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserData, setEditUserData] = useState({
    name: '',
    phone: '',
    governorate: '',
    area: '',
    address: '',
  });
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [showPetDetailsModal, setShowPetDetailsModal] = useState(false);
  const [showEditPetModal, setShowEditPetModal] = useState(false);
  // Hotel state
  const [hotelRooms, setHotelRooms] = useState<any[]>([]);
  const [hotelCounts, setHotelCounts] = useState<any>({ DOG: 0, CAT: 0, BIRD: 0, available: 0, occupied: 0 });
  const [hotelReservations, setHotelReservations] = useState<any[]>([]);
  const [hotelFilterType, setHotelFilterType] = useState<'ALL' | 'DOG' | 'CAT' | 'BIRD'>('ALL');
  const [showHotelReservationModal, setShowHotelReservationModal] = useState(false);
  const [newHotelReservation, setNewHotelReservation] = useState({
    roomId: '',
    ownerName: '',
    ownerPhone: '',
    petName: '',
    checkIn: '',
    checkOut: '',
    notes: '',
  });
  const [editingPet, setEditingPet] = useState<any>(null);
  const [editPetData, setEditPetData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    birthDate: '',
    color: '',
    allergies: '',
    medications: '',
    medicalHistory: '',
    surgicalHistory: '',
    chronicConditions: '',
  });
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(false);
  const [newOwnerData, setNewOwnerData] = useState({
    name: '',
    email: '',
    phone: '',
    governorate: '',
    area: '',
    address: '',
    password: '',
  });
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [newPetData, setNewPetData] = useState({
    userId: '',
    name: '',
    species: '',
    breed: '',
    gender: '',
    birthDate: '',
    color: '',
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [analyticsPeriod, setAnalyticsPeriod] = useState('week');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [revenueDetails, setRevenueDetails] = useState<any>(null);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [revenueDetailsLoading, setRevenueDetailsLoading] = useState(false);
  const [revenuePeriod, setRevenuePeriod] = useState('all');
  const [selectedRevenueItem, setSelectedRevenueItem] = useState<any | null>(null);
  const [showRevenueItemDetails, setShowRevenueItemDetails] = useState(false);
  const [showAnalyticsDetailsModal, setShowAnalyticsDetailsModal] = useState(false);
  const [selectedAnalyticsType, setSelectedAnalyticsType] = useState<'orders' | 'appointments' | 'hotel' | null>(null);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    governorate: '',
    area: '',
    searchCustomer: '',
    deliveryMethod: 'instore',
    paymentMethod: 'cash' as 'cash' | 'visa' | 'click',
    status: 'pending',
    notes: '',
    items: [] as { productId: string; quantity: number; price: number }[]
  });
  const [selectedProductForOrder, setSelectedProductForOrder] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [ownerSearchTerm, setOwnerSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('all');
  const [appointmentStartDate, setAppointmentStartDate] = useState('');
  const [appointmentEndDate, setAppointmentEndDate] = useState('');
  const [appointmentSearchTerm, setAppointmentSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showAppointmentDetailsModal, setShowAppointmentDetailsModal] = useState(false);
  const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [editAppointmentData, setEditAppointmentData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: '',
    status: '',
    completionPrice: '',
    completionPaymentMethod: '',
  });
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [newAppointmentData, setNewAppointmentData] = useState({
    userId: '',
    ownerName: '',
    ownerPhone: '',
    petId: '',
    petName: '',
    searchOwner: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: '',
  });
  const [selectedOwnerPets, setSelectedOwnerPets] = useState<any[]>([]);
  const router = useRouter();

  // Helper function to change tabs and save to localStorage
  const handleTabChange = (tab: 'products' | 'orders' | 'analytics' | 'owners' | 'appointments' | 'hotel') => {
    setActiveTab(tab);
    localStorage.setItem('adminActiveTab', tab);
  };

  useEffect(() => {
    // Open specific tab if provided via query ?tab=, otherwise use saved tab
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'hotel' || tab === 'orders' || tab === 'analytics' || tab === 'owners' || tab === 'appointments' || tab === 'products') {
        setActiveTab(tab as any);
        // Save the tab to localStorage when coming from a URL parameter
        localStorage.setItem('adminActiveTab', tab);
        // Clean up URL parameter to prevent issues on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      } else {
        // No URL parameter, try to restore from localStorage
        const savedTab = localStorage.getItem('adminActiveTab');
        if (savedTab === 'hotel' || savedTab === 'orders' || savedTab === 'analytics' || savedTab === 'owners' || savedTab === 'appointments' || savedTab === 'products') {
          setActiveTab(savedTab as any);
        }
      }
    }
    // Check if user is logged in
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      router.push('/admin/login');
      return;
    }

    fetchData();
  }, [router]);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchCategories();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'owners') {
      fetchUsers();
    } else if (activeTab === 'appointments') {
      fetchAppointments();
    } else if (activeTab === 'hotel') {
      fetchHotelRooms();
      fetchHotelReservations();
    }
  }, [activeTab, selectedOrderStatus, startDate, endDate, analyticsPeriod, appointmentStatusFilter, appointmentStartDate, appointmentEndDate, appointmentSearchTerm]);

  // Fetch data when analytics modal opens
  useEffect(() => {
    if (showAnalyticsDetailsModal) {
      if (selectedAnalyticsType === 'orders') {
        // Fetch all orders without filters
        const fetchAllOrders = async () => {
          try {
            const ordersRes = await fetch('/api/orders');
            if (ordersRes.ok) {
              const ordersData = await ordersRes.json();
              setOrders(ordersData.orders);
            }
          } catch (error) {
            console.error('Error fetching orders:', error);
          }
        };
        fetchAllOrders();
      } else if (selectedAnalyticsType === 'appointments') {
        // Fetch all appointments without filters
        const fetchAllAppointments = async () => {
          try {
            const res = await fetch('/api/appointments');
            const data = await res.json();
            setAppointments(data.appointments || []);
          } catch (error) {
            console.error('Error fetching appointments:', error);
          }
        };
        fetchAllAppointments();
      } else if (selectedAnalyticsType === 'hotel') {
        fetchHotelReservations();
      }
    }
  }, [showAnalyticsDetailsModal, selectedAnalyticsType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const productsRes = await fetch('/api/admin/products');

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      
      if (selectedOrderStatus !== 'all') {
        params.append('status', selectedOrderStatus);
      }
      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }
      
      const url = params.toString() ? `/api/orders?${params.toString()}` : '/api/orders';
      const ordersRes = await fetch(url);
      
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/analytics?period=${analyticsPeriod}`);
      const data = await res.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchHotelRooms = async () => {
    try {
      const res = await fetch('/api/hotel/rooms');
      const data = await res.json();
      setHotelRooms(data.rooms || []);
      setHotelCounts(data.counts || { DOG: 0, CAT: 0, BIRD: 0, available: 0, occupied: 0 });
    } catch (error) {
      console.error('Error fetching hotel rooms:', error);
    }
  };

  const fetchHotelReservations = async () => {
    try {
      const res = await fetch('/api/hotel/reservations');
      const data = await res.json();
      setHotelReservations(data.reservations || []);
    } catch (error) {
      console.error('Error fetching hotel reservations:', error);
    }
  };

  const handleOpenReservation = (roomId: string) => {
    setNewHotelReservation((prev) => ({
      ...prev,
      roomId,
    }));
    setShowHotelReservationModal(true);
  };

  const handleCreateHotelReservation = async () => {
    if (!newHotelReservation.roomId || !newHotelReservation.checkIn || !newHotelReservation.checkOut) {
      alert('Please select a room and provide check-in and check-out dates');
      return;
    }

    try {
      const res = await fetch('/api/hotel/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: newHotelReservation.roomId,
          ownerName: newHotelReservation.ownerName || null,
          ownerPhone: newHotelReservation.ownerPhone || null,
          petName: newHotelReservation.petName || null,
          checkIn: newHotelReservation.checkIn,
          checkOut: newHotelReservation.checkOut,
          notes: newHotelReservation.notes || null,
        }),
      });

      if (res.ok) {
        alert('Reservation created');
        setShowHotelReservationModal(false);
        setNewHotelReservation({ roomId: '', ownerName: '', ownerPhone: '', petName: '', checkIn: '', checkOut: '', notes: '' });
        await fetchHotelReservations();
        await fetchHotelRooms();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create reservation');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Error creating reservation');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      // The API already filters for users with role='user', so no need to filter again
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const params = new URLSearchParams();
      
      if (appointmentStatusFilter !== 'all') {
        params.append('status', appointmentStatusFilter);
      }
      if (appointmentStartDate) {
        params.append('startDate', appointmentStartDate);
      }
      if (appointmentEndDate) {
        params.append('endDate', appointmentEndDate);
      }
      if (appointmentSearchTerm) {
        params.append('search', appointmentSearchTerm);
      }
      
      const url = params.toString() ? `/api/appointments?${params.toString()}` : '/api/appointments';
      const res = await fetch(url);
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      setSelectedUser(data.user);
      setShowUserDetailsModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserData({
      name: user.name || '',
      phone: user.phone || '',
      governorate: user.governorate || '',
      area: user.area || '',
      address: user.address || '',
    });
    setShowEditUserModal(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUserData),
      });

      if (res.ok) {
        alert('User updated successfully!');
        setShowEditUserModal(false);
        setEditingUser(null);
        fetchUsers();
        // Refresh the selected user if user details modal is open
        if (selectedUser && showUserDetailsModal) {
          await fetchUserDetails(editingUser.id);
        } else {
          setShowUserDetailsModal(false);
        }
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('An error occurred while updating the user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their pets, orders, and appointments.')) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('User deleted successfully!');
        fetchUsers();
        setShowUserDetailsModal(false);
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user');
    }
  };

  const fetchPetDetails = async (petId: string) => {
    try {
      const res = await fetch(`/api/pets/${petId}`);
      const data = await res.json();
      setSelectedPet(data.pet);
      setShowPetDetailsModal(true);
    } catch (error) {
      console.error('Error fetching pet details:', error);
    }
  };

  const handleEditPet = (pet: any) => {
    setEditingPet(pet);
    setEditPetData({
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      gender: pet.gender || '',
      birthDate: pet.birthDate ? new Date(pet.birthDate).toISOString().split('T')[0] : '',
      color: pet.color || '',
      allergies: pet.allergies || '',
      medications: pet.medications || '',
      medicalHistory: pet.medicalHistory || '',
      surgicalHistory: pet.surgicalHistory || '',
      chronicConditions: pet.chronicConditions || '',
    });
    setShowEditPetModal(true);
  };

  const handleSavePet = async () => {
    if (!editingPet) return;

    try {
      const res = await fetch(`/api/pets/${editingPet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPetData),
      });

      if (res.ok) {
        alert('Pet updated successfully!');
        setShowEditPetModal(false);
        setEditingPet(null);
        // Refresh user details if user modal is open
        if (selectedUser) {
          await fetchUserDetails(selectedUser.id);
        }
        setShowPetDetailsModal(false);
      } else {
        alert('Failed to update pet');
      }
    } catch (error) {
      console.error('Error updating pet:', error);
      alert('An error occurred while updating the pet');
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!confirm('Are you sure you want to delete this pet?')) {
      return;
    }

    try {
      const res = await fetch(`/api/pets/${petId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Pet deleted successfully!');
        // Refresh user details
        if (selectedUser) {
          await fetchUserDetails(selectedUser.id);
        }
        setShowPetDetailsModal(false);
      } else {
        alert('Failed to delete pet');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      alert('An error occurred while deleting the pet');
    }
  };

  const handleAddOwner = async () => {
    if (!newOwnerData.name || !newOwnerData.phone) {
      alert('Please fill in name and phone');
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOwnerData),
      });

      if (res.ok) {
        alert('Owner added successfully!');
        setShowAddOwnerModal(false);
        setNewOwnerData({
          name: '',
          email: '',
          phone: '',
          governorate: '',
          area: '',
          address: '',
          password: '',
        });
        fetchUsers();
      } else {
        const data = await res.json();
        alert(`Failed to add owner: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding owner:', error);
      alert('An error occurred while adding the owner');
    }
  };

  const handleAddPet = async () => {
    if (!newPetData.name || !newPetData.species) {
      alert('Please fill in pet name and species');
      return;
    }

    try {
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPetData),
      });

      if (res.ok) {
        alert('Pet added successfully!');
        setShowAddPetModal(false);
        setNewPetData({
          userId: '',
          name: '',
          species: '',
          breed: '',
          gender: '',
          birthDate: '',
          color: '',
        });
        // Refresh user details
        if (selectedUser) {
          await fetchUserDetails(selectedUser.id);
        }
        fetchUsers();
      } else {
        const data = await res.json();
        alert(`Failed to add pet: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding pet:', error);
      alert('An error occurred while adding the pet');
    }
  };

  const fetchRevenueDetails = async () => {
    setRevenueDetailsLoading(true);
    try {
      // Calculate date range based on period
      let startDate = '';
      let endDate = '';
      const now = new Date();
      
      switch (revenuePeriod) {
        case 'today':
          startDate = now.toISOString().split('T')[0];
          endDate = now.toISOString().split('T')[0];
          break;
        case 'week':
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          startDate = weekAgo.toISOString().split('T')[0];
          endDate = now.toISOString().split('T')[0];
          break;
        case 'month':
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          startDate = monthAgo.toISOString().split('T')[0];
          endDate = now.toISOString().split('T')[0];
          break;
        case 'year':
          const yearAgo = new Date(now);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          startDate = yearAgo.toISOString().split('T')[0];
          endDate = now.toISOString().split('T')[0];
          break;
        default:
          // 'all' - no date filtering
          break;
      }
      
      // Fetch orders, appointments, and hotel reservations
      const ordersUrl = revenuePeriod === 'all' 
        ? '/api/orders?status=all'
        : `/api/orders?status=all&startDate=${startDate}&endDate=${endDate}`;
      
      const appointmentsUrl = revenuePeriod === 'all'
        ? '/api/appointments?status=completed'
        : `/api/appointments?status=completed&startDate=${startDate}&endDate=${endDate}`;
      
      const hotelReservationsUrl = revenuePeriod === 'all'
        ? '/api/hotel/reservations'
        : `/api/hotel/reservations?status=checked_out`;
      
      const [ordersRes, appointmentsRes, hotelRes] = await Promise.all([
        fetch(ordersUrl),
        fetch(appointmentsUrl),
        fetch(hotelReservationsUrl)
      ]);
      
      const [ordersData, appointmentsData, hotelData] = await Promise.all([
        ordersRes.json(),
        appointmentsRes.json(),
        hotelRes.json()
      ]);
      
      // Filter out cancelled and pending orders for revenue calculation (only completed orders)
      const nonCancelledOrders = (ordersData.orders || []).filter((order: any) => order.status === 'completed');
      
      // Format appointments for display (similar to orders)
      const formattedAppointments = (appointmentsData.appointments || [])
        .filter((apt: any) => apt.completionPrice) // Only include appointments with prices
        .map((apt: any) => ({
          id: apt.id,
          type: 'appointment',
          customerName: apt.user?.name || 'N/A',
          customerPhone: apt.user?.phone || 'N/A',
          appointmentDate: apt.appointmentDate,
          appointmentTime: apt.appointmentTime,
          petName: apt.petName || 'General Appointment',
          reason: apt.reason,
          total: apt.completionPrice,
          status: apt.status,
          paymentMethod: apt.completionPaymentMethod || 'N/A',
          createdAt: apt.createdAt
        }));
      
      // Format hotel reservations for display
      const formattedHotels = (hotelData.reservations || [])
        .filter((res: any) => res.status === 'checked_out' && res.total) // Only include checked out reservations with totals
        .filter((res: any) => {
          // Apply date filtering if period is not 'all'
          if (revenuePeriod !== 'all' && (startDate || endDate)) {
            const resDate = new Date(res.createdAt).toISOString().split('T')[0];
            return (!startDate || resDate >= startDate) && (!endDate || resDate <= endDate);
          }
          return true;
        })
        .map((res: any) => ({
          id: res.id,
          type: 'hotel',
          customerName: res.user?.name || res.ownerName || 'N/A',
          customerPhone: res.user?.phone || res.ownerPhone || 'N/A',
          roomType: res.room?.type || 'N/A',
          roomNumber: res.room?.roomNumber || 'N/A',
          petName: res.petName,
          checkIn: res.checkIn,
          checkOut: res.checkOut,
          total: res.total,
          status: res.status,
          paymentMethod: res.paymentMethod || 'N/A',
          createdAt: res.createdAt,
          totalNights: res.totalNights,
          roomRate: res.roomRate,
          subtotal: res.subtotal,
          pickupFee: res.pickupFee,
          dropoffFee: res.dropoffFee,
          extraServices: res.extraServices,
          pickup: res.pickup,
          dropoff: res.dropoff,
        }));
      
      // Combine orders, appointments, and hotel reservations, sorted by date
      const combinedRevenue = [...nonCancelledOrders, ...formattedAppointments, ...formattedHotels]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setRevenueDetails(combinedRevenue);
    } catch (error) {
      console.error('Error fetching revenue details:', error);
    } finally {
      setRevenueDetailsLoading(false);
    }
  };

  const handleViewRevenueDetails = () => {
    setShowRevenueModal(true);
    fetchRevenueDetails();
  };

  // Refetch revenue details when period changes
  useEffect(() => {
    if (showRevenueModal) {
      fetchRevenueDetails();
    }
  }, [revenuePeriod]);

  const handleAddProductToOrder = () => {
    if (!selectedProductForOrder) return;
    
    const product = products.find(p => p.id === selectedProductForOrder);
    if (!product) return;

    const existingItemIndex = newOrderData.items.findIndex(item => item.productId === selectedProductForOrder);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...newOrderData.items];
      updatedItems[existingItemIndex].quantity += selectedQuantity;
      setNewOrderData({ ...newOrderData, items: updatedItems });
    } else {
      setNewOrderData({
        ...newOrderData,
        items: [...newOrderData.items, {
          productId: selectedProductForOrder,
          quantity: selectedQuantity,
          price: product.price
        }]
      });
    }

    setSelectedProductForOrder('');
    setSelectedQuantity(1);
  };

  const handleRemoveProductFromOrder = (index: number) => {
    const updatedItems = newOrderData.items.filter((_, i) => i !== index);
    setNewOrderData({ ...newOrderData, items: updatedItems });
  };

  const calculateOrderTotal = () => {
    const itemsTotal = newOrderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = newOrderData.deliveryMethod === 'delivery' ? 3 : 0;
    return itemsTotal + deliveryFee;
  };

  const handleSubmitOrder = async () => {
    if (newOrderData.items.length === 0) {
      alert('Please add at least one product to the order');
      return;
    }

    if (!newOrderData.customerName || !newOrderData.customerPhone) {
      alert('Please fill in customer name and phone');
      return;
    }

    // If delivery method is "delivery", governorate, area, and address are required
    if (newOrderData.deliveryMethod === 'delivery') {
      if (!newOrderData.governorate) {
        alert('Please select a governorate for delivery orders');
        return;
      }
      if (!newOrderData.area) {
        alert('Please select an area for delivery orders');
        return;
      }
      if (!newOrderData.customerAddress) {
        alert('Please fill in the customer address for delivery orders');
        return;
      }
    }

    // Find matching user by name and phone to link the order
    const matchedUser = users.find(user => 
      user.name === newOrderData.customerName && 
      user.phone === newOrderData.customerPhone
    );

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: matchedUser?.id || null, // Link to user if found
          customerName: newOrderData.customerName,
          customerEmail: matchedUser?.email || newOrderData.customerPhone + '@vetclinic.local',
          customerPhone: newOrderData.customerPhone,
          customerAddress: `${newOrderData.governorate ? `${newOrderData.governorate}, ` : ''}${newOrderData.area ? `${newOrderData.area}, ` : ''}${newOrderData.customerAddress}`,
          deliveryMethod: newOrderData.deliveryMethod,
          paymentMethod: newOrderData.paymentMethod,
          status: newOrderData.status,
          notes: newOrderData.notes,
          orderItems: newOrderData.items,
          total: calculateOrderTotal()
        })
      });

      if (response.ok) {
        alert('Order added successfully!');
        setShowAddOrderModal(false);
        setNewOrderData({
          customerName: '',
          customerPhone: '',
          customerAddress: '',
          governorate: '',
          area: '',
          searchCustomer: '',
          deliveryMethod: 'instore',
          paymentMethod: 'cash',
          status: 'pending',
          notes: '',
          items: []
        });
        fetchOrders(); // Refresh orders list
        handleTabChange('orders'); // Switch to orders tab
      } else {
        const data = await response.json();
        alert(`Failed to add order: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding order:', error);
      alert('An error occurred while adding the order');
    }
  };

  const getMainCategories = () => {
    return ['All Products', 'Dogs', 'Cats', 'Birds', 'Fish & Aquatic', 'Small Animals', 'Reptiles', 'General'];
  };

  const getSubcategories = (mainCategory: string) => {
    if (mainCategory === 'All Products') return [];
    
    const prefixMap: { [key: string]: string[] } = {
      'Dogs': ['dog'],
      'Cats': ['cat'],
      'Birds': ['bird'],
      'Fish & Aquatic': ['fish'],
      'Small Animals': ['small'],
      'Reptiles': ['reptile'],
      'General': ['general', 'housing', 'cleaning']
    };
    
    const prefixes = prefixMap[mainCategory] || [];
    if (prefixes.length === 0) return [];
    
    return categories.filter(cat => 
      prefixes.some(prefix => cat.name.toLowerCase().startsWith(prefix))
    );
  };

  const handleMainCategoryClick = (category: string) => {
    if (category === 'All Products') {
      setSelectedMainCategory(null);
      setSelectedCategory('all');
    } else {
      setSelectedMainCategory(category);
    }
  };

  const handleSubcategoryClick = (slug: string) => {
    setSelectedCategory(slug);
  };

  const removeItemCount = (name: string) => {
    return name.replace(/\s*\([^)]*\)\s*$/, '');
  };

  const getFilteredProducts = () => {
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.category.slug === selectedCategory);
  };

  const subcategories = selectedMainCategory ? getSubcategories(selectedMainCategory) : [];
  const displayCategories = selectedMainCategory ? subcategories : getMainCategories();
  const filteredProducts = getFilteredProducts();

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
        alert('Product deleted successfully!');
      } else {
        const data = await response.json();
        alert(`Failed to delete product: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product. Please try again.');
    }
  };

  const handleViewAppointmentDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetailsModal(true);
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setEditAppointmentData({
      appointmentDate: appointment.appointmentDate ? new Date(appointment.appointmentDate).toISOString().split('T')[0] : '',
      appointmentTime: appointment.appointmentTime || '',
      reason: appointment.reason || '',
      notes: appointment.notes || '',
      status: appointment.status || '',
      completionPrice: appointment.completionPrice || '',
      completionPaymentMethod: appointment.completionPaymentMethod || '',
    });
    setShowEditAppointmentModal(true);
    setShowAppointmentDetailsModal(false);
  };

  const handleSaveAppointment = async () => {
    if (!editingAppointment) return;

    try {
      const res = await fetch(`/api/appointments/${editingAppointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editAppointmentData),
      });

      if (res.ok) {
        alert('Appointment updated successfully!');
        setShowEditAppointmentModal(false);
        setEditingAppointment(null);
        fetchAppointments();
        // Refresh appointment details if modal is open
        if (selectedAppointment && showAppointmentDetailsModal) {
          setSelectedAppointment(null);
        }
      } else {
        alert('Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('An error occurred while updating the appointment');
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Appointment deleted successfully!');
        fetchAppointments();
        setShowAppointmentDetailsModal(false);
      } else {
        alert('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('An error occurred while deleting the appointment');
    }
  };

  const handleOwnerChange = async (userId: string) => {
    setNewAppointmentData({ ...newAppointmentData, userId, petId: '', petName: '' });
    if (!userId) {
      setSelectedOwnerPets([]);
      return;
    }
    
    // Fetch pets for the selected owner
    try {
      const res = await fetch(`/api/pets?userId=${userId}`);
      const data = await res.json();
      setSelectedOwnerPets(data.pets || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setSelectedOwnerPets([]);
    }
  };

  const handlePetChange = (petId: string) => {
    const selectedPet = selectedOwnerPets.find(p => p.id === petId);
    setNewAppointmentData({
      ...newAppointmentData,
      petId,
      petName: selectedPet ? selectedPet.name : '',
    });
  };

  const handleAddAppointment = async () => {
    if (!newAppointmentData.ownerName || !newAppointmentData.appointmentDate || !newAppointmentData.appointmentTime || !newAppointmentData.reason) {
      alert('Please fill in all required fields (Owner Name, Date, Time, and Reason)');
      return;
    }

    // If no existing user selected, phone number is required
    if (!newAppointmentData.userId && !newAppointmentData.ownerPhone) {
      alert('Please provide a phone number for the owner');
      return;
    }

    try {
      // Prepare appointment data - if userId is set, use it; otherwise just send the name and phone
      const appointmentData = {
        userId: newAppointmentData.userId || null,
        ownerName: newAppointmentData.ownerName,
        ownerPhone: newAppointmentData.ownerPhone || null,
        petId: newAppointmentData.petId || null,
        petName: newAppointmentData.petName || null,
        appointmentDate: newAppointmentData.appointmentDate,
        appointmentTime: newAppointmentData.appointmentTime,
        reason: newAppointmentData.reason,
        notes: newAppointmentData.notes || null,
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (res.ok) {
        alert('Appointment added successfully!');
        setShowAddAppointmentModal(false);
        setNewAppointmentData({
          userId: '',
          ownerName: '',
          ownerPhone: '',
          petId: '',
          petName: '',
          searchOwner: '',
          appointmentDate: '',
          appointmentTime: '',
          reason: '',
          notes: '',
        });
        setSelectedOwnerPets([]);
        fetchAppointments();
      } else {
        const data = await res.json();
        alert(`Failed to add appointment: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
      alert('An error occurred while adding the appointment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-primary">
                First Pet Veterinary clinic And Grooming
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-700">Admin Dashboard</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('products')}
              className={`${
                activeTab === 'products'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => handleTabChange('orders')}
              className={`${
                activeTab === 'orders'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => handleTabChange('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Analytics
            </button>
            <button
              onClick={() => handleTabChange('owners')}
              className={`${
                activeTab === 'owners'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Owners ({users.length})
            </button>
            <button
              onClick={() => handleTabChange('appointments')}
              className={`${
                activeTab === 'appointments'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Appointments ({appointments.length})
            </button>
            <button
              onClick={() => handleTabChange('hotel')}
              className={`${
                activeTab === 'hotel'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Hotel
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'products' ? (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Categories Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
                {selectedMainCategory && (
                  <button
                    onClick={() => {
                      setSelectedMainCategory(null);
                      setSelectedCategory('all');
                    }}
                    className="mb-4 text-sm text-primary hover:underline"
                  >
                    ← Back
                  </button>
                )}
                <ul className="space-y-2">
                  {displayCategories.map((category) => {
                    const isActive = typeof category === 'string'
                      ? selectedMainCategory === category
                      : selectedCategory === category.slug;

                    return (
                      <li key={typeof category === 'string' ? category : category.id}>
                        <button
                          onClick={() => {
                            if (typeof category === 'string') {
                              handleMainCategoryClick(category);
                            } else {
                              handleSubcategoryClick(category.slug);
                            }
                          }}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {typeof category === 'string' ? category : removeItemCount(category.name)}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Products Section */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <Link
                  href="/admin/products/new"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add New Product
                </Link>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No products found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      <Link href={`/shop/${product.slug}`} className="block">
                        <div className="relative w-full h-48 bg-gray-100">
                          <Image
                            src={(product.image && product.image.includes(',') ? product.image.split(',')[0] : product.image) || '/api/placeholder/400/400'}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {product.stock === 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                              Out of Stock
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">{product.category.name}</p>
                          <p className="text-2xl font-bold text-primary">
                            {formatPrice(product.price)}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">Stock: {product.stock}</p>
                        </div>
                      </Link>
                      <div className="p-4 border-t border-gray-200 flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="flex-1 text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'analytics' ? (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
                <select
                  value={analyticsPeriod}
                  onChange={(e) => setAnalyticsPeriod(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="today">Today</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>

            {analyticsLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading analytics...</p>
              </div>
            ) : analyticsData ? (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Page Views</h3>
                    <p className="text-3xl font-bold text-primary">{analyticsData.pageViews}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Unique Visitors</h3>
                    <p className="text-3xl font-bold text-blue-600">{analyticsData.uniqueVisitors}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Product Views</h3>
                    <p className="text-3xl font-bold text-green-600">{analyticsData.productViews}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Orders</h3>
                    <p className="text-3xl font-bold text-yellow-600">{analyticsData.orders}</p>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Total Revenue</h3>
                      <p className="text-3xl font-bold text-primary">{formatPrice(analyticsData.totalRevenue || analyticsData.revenue)}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Orders: {formatPrice(analyticsData.revenue)}</p>
                        {analyticsData.appointmentRevenue && analyticsData.appointmentRevenue > 0 && (
                          <p>Appointments: {formatPrice(analyticsData.appointmentRevenue)}</p>
                        )}
                        {analyticsData.hotelRevenue && analyticsData.hotelRevenue > 0 && (
                          <p>Hotel: {formatPrice(analyticsData.hotelRevenue)}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleViewRevenueDetails}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Appointments Analytics Card */}
                {analyticsData.appointments && (
                  <div className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelectedAnalyticsType('appointments'); setShowAnalyticsDetailsModal(true); }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Appointments</h3>
                        <p className="text-3xl font-bold text-purple-600">{analyticsData.appointments.total}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-600 mb-1">Upcoming</p>
                        <p className="text-2xl font-bold text-blue-700">{analyticsData.appointments.upcoming}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-green-600 mb-1">Completed</p>
                        <p className="text-2xl font-bold text-green-700">{analyticsData.appointments.completed}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-red-600 mb-1">Cancelled</p>
                        <p className="text-2xl font-bold text-red-700">{analyticsData.appointments.cancelled}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders Analytics Card */}
                {analyticsData.ordersStats && (
                  <div className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelectedAnalyticsType('orders'); setShowAnalyticsDetailsModal(true); }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Orders</h3>
                        <p className="text-3xl font-bold text-yellow-600">{analyticsData.ordersStats.total}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-yellow-600 mb-1">Pending</p>
                        <p className="text-2xl font-bold text-yellow-700">{analyticsData.ordersStats.pending}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-green-600 mb-1">Completed</p>
                        <p className="text-2xl font-bold text-green-700">{analyticsData.ordersStats.completed}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-red-600 mb-1">Cancelled</p>
                        <p className="text-2xl font-bold text-red-700">{analyticsData.ordersStats.cancelled}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hotel Reservations Analytics Card */}
                {analyticsData.hotelReservations && (
                  <div className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelectedAnalyticsType('hotel'); setShowAnalyticsDetailsModal(true); }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Hotel Reservations</h3>
                        <p className="text-3xl font-bold text-indigo-600">{analyticsData.hotelReservations.total}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-600 mb-1">Booked</p>
                        <p className="text-2xl font-bold text-blue-700">{analyticsData.hotelReservations.booked}</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-yellow-600 mb-1">Checked In</p>
                        <p className="text-2xl font-bold text-yellow-700">{analyticsData.hotelReservations.checkedIn}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-green-600 mb-1">Checked Out</p>
                        <p className="text-2xl font-bold text-green-700">{analyticsData.hotelReservations.checkedOut}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-red-600 mb-1">Cancelled</p>
                        <p className="text-2xl font-bold text-red-700">{analyticsData.hotelReservations.cancelled}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Top Products by Views</h3>
                  {analyticsData.topProducts && analyticsData.topProducts.length > 0 ? (
                    <div className="space-y-4">
                      {analyticsData.topProducts.map((product: any, index: number) => (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-gray-400">#{index + 1}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-600">{product.category.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{product.views}</p>
                            <p className="text-xs text-gray-500">views</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No product views yet</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No analytics data available</p>
              </div>
            )}
          </div>
        ) : activeTab === 'owners' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pet Owners</h2>
              <button
                onClick={() => setShowAddOwnerModal(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Owner
              </button>
            </div>
            
            {/* Search Filter */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  value={ownerSearchTerm}
                  onChange={(e) => setOwnerSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {(() => {
              const filteredUsers = users.filter((user) => {
                if (!ownerSearchTerm) return true;
                const search = ownerSearchTerm.toLowerCase();
                return (
                  user.name?.toLowerCase().includes(search) ||
                  user.phone?.toLowerCase().includes(search) ||
                  user.email?.toLowerCase().includes(search)
                );
              });

              if (filteredUsers.length === 0) {
                return (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      {ownerSearchTerm ? 'No users found matching your search.' : 'No users found.'}
                    </p>
                    {ownerSearchTerm && (
                      <button
                        onClick={() => setOwnerSearchTerm('')}
                        className="mt-4 text-primary hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => fetchUserDetails(user.id)}
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {user.name || 'No name'}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.phone && (
                        <p className="text-sm text-gray-600">{user.phone}</p>
                      )}
                    </div>
                    <div className="mb-4">
                      <div>
                        <p className="text-xs text-gray-600">Pets</p>
                        <p className="text-xl font-bold text-primary">{user.petsCount || 0}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchUserDetails(user.id);
                        }}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditUser(user);
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
            })()}
          </div>
        ) : activeTab === 'appointments' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
              <button
                onClick={() => setShowAddAppointmentModal(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Appointment
              </button>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div>
                  <label htmlFor="appointmentSearch" className="block text-sm font-medium text-gray-700 mb-2">
                    Search by Customer Name, Phone, or Pet Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="appointmentSearch"
                      value={appointmentSearchTerm}
                      onChange={(e) => setAppointmentSearchTerm(e.target.value)}
                      placeholder="Search appointments..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <svg 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="appointmentStatus" className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by status
                    </label>
                    <select
                      id="appointmentStatus"
                      value={appointmentStatusFilter}
                      onChange={(e) => setAppointmentStatusFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">All Appointments</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="appointmentStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      id="appointmentStartDate"
                      value={appointmentStartDate}
                      onChange={(e) => setAppointmentStartDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="appointmentEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      id="appointmentEndDate"
                      value={appointmentEndDate}
                      onChange={(e) => setAppointmentEndDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setAppointmentStartDate('');
                        setAppointmentEndDate('');
                        setAppointmentStatusFilter('all');
                        setAppointmentSearchTerm('');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No appointments found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {appointments.map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewAppointmentDetails(appointment)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {appointment.petName || 'General Appointment'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <strong>Customer:</strong> {appointment.user?.name || appointment.ownerName || 'N/A'} ({appointment.user?.phone || appointment.ownerPhone || 'N/A'})
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                        </p>
                        {appointment.reason && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Reason:</strong> {appointment.reason}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          appointment.status === 'upcoming'
                            ? 'bg-blue-100 text-blue-800'
                            : appointment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    {appointment.notes && (
                      <div className="border-t pt-4 mt-4">
                        <p className="text-sm text-gray-600"><strong>Notes:</strong></p>
                        <p className="text-sm text-gray-900">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'hotel' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pet Hotel</h2>
              <div className="flex gap-2">
                {hotelRooms.length === 0 && (
                  <button
                    onClick={async () => {
                      await fetch('/api/hotel/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ init: true }) });
                      await fetchHotelRooms();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Initialize Rooms
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border cursor-pointer" onClick={() => { router.push('/admin/hotel/dogs'); }}>
                <p className="text-sm text-gray-600">Dog Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{hotelCounts.DOG} / 5</p>
              </div>
              <div className="bg-white rounded-lg p-4 border cursor-pointer" onClick={() => { router.push('/admin/hotel/cats'); }}>
                <p className="text-sm text-gray-600">Cat Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{hotelCounts.CAT} / 10</p>
              </div>
              <div className="bg-white rounded-lg p-4 border cursor-pointer" onClick={() => { router.push('/admin/hotel/birds'); }}>
                <p className="text-sm text-gray-600">Bird Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{hotelCounts.BIRD} / 5</p>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <p className="text-sm text-gray-600">Available / Occupied</p>
                <p className="text-2xl font-bold text-gray-900">{hotelCounts.available} / {hotelCounts.occupied}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Rooms</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-2 py-1 rounded cursor-pointer ${hotelFilterType==='ALL'?'bg-primary text-white':'bg-gray-100 text-gray-700'}`} onClick={() => setHotelFilterType('ALL')}>All</span>
                  <span className={`px-2 py-1 rounded cursor-pointer ${hotelFilterType==='DOG'?'bg-primary text-white':'bg-gray-100 text-gray-700'}`} onClick={() => setHotelFilterType('DOG')}>Dogs</span>
                  <span className={`px-2 py-1 rounded cursor-pointer ${hotelFilterType==='CAT'?'bg-primary text-white':'bg-gray-100 text-gray-700'}`} onClick={() => setHotelFilterType('CAT')}>Cats</span>
                  <span className={`px-2 py-1 rounded cursor-pointer ${hotelFilterType==='BIRD'?'bg-primary text-white':'bg-gray-100 text-gray-700'}`} onClick={() => setHotelFilterType('BIRD')}>Birds</span>
                </div>
              </div>
              {hotelRooms.length === 0 ? (
                <p className="text-gray-600">No rooms yet. Click &quot;Initialize Rooms&quot; to create them.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {hotelRooms.filter((r:any)=>hotelFilterType==='ALL' || r.type===hotelFilterType).map((room: any) => (
                    <div key={room.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">{room.type} Room</p>
                          <p className="text-xl font-bold">#{room.roomNumber}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${room.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : room.status === 'OCCUPIED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                          {room.status}
                        </span>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => handleOpenReservation(room.id)}
                          className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
                        >
                          Reserve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Reservations</h3>
              {hotelReservations.length === 0 ? (
                <p className="text-gray-600">No reservations yet.</p>
              ) : (
                <div className="space-y-3">
                  {hotelReservations.slice(0, 10).map((r: any) => (
                    <div key={r.id} className="border rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{r.room.type} #{r.room.roomNumber}</p>
                        <p className="text-sm text-gray-600">{new Date(r.checkIn).toLocaleDateString()} → {new Date(r.checkOut).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">{r.user?.name || r.ownerName || 'Unknown'} • {r.user?.phone || r.ownerPhone || 'N/A'}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">{r.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
                <button
                  onClick={() => setShowAddOrderModal(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Order
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by status
                    </label>
                    <select
                      id="orderStatus"
                      value={selectedOrderStatus}
                      onChange={(e) => setSelectedOrderStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">All Orders</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                        setSelectedOrderStatus('all');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No orders found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id.slice(-8)}
                      </h3>
                      <p className="text-gray-600">{order.customerName}</p>
                      <p className="text-gray-600">{order.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(order.total)}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-primary hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Revenue Details Modal */}

      {/* Hotel Reservation Modal */}
      {showHotelReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Create Reservation</h2>
              <button onClick={() => setShowHotelReservationModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room *</label>
                <select
                  value={newHotelReservation.roomId}
                  onChange={(e)=>setNewHotelReservation({ ...newHotelReservation, roomId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a room</option>
                  {hotelRooms.filter((r:any)=>hotelFilterType==='ALL' || r.type===hotelFilterType).map((r:any)=>(
                    <option key={r.id} value={r.id}>{r.type} #{r.roomNumber}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                  <input
                    type="text"
                    value={newHotelReservation.ownerName}
                    onChange={(e)=>setNewHotelReservation({ ...newHotelReservation, ownerName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Optional if linked to user later"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner Phone</label>
                  <input
                    type="tel"
                    value={newHotelReservation.ownerPhone}
                    onChange={(e)=>setNewHotelReservation({ ...newHotelReservation, ownerPhone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
                <input
                  type="text"
                  value={newHotelReservation.petName}
                  onChange={(e)=>setNewHotelReservation({ ...newHotelReservation, petName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Optional"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in *</label>
                  <input
                    type="date"
                    value={newHotelReservation.checkIn}
                    onChange={(e)=>setNewHotelReservation({ ...newHotelReservation, checkIn: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out *</label>
                  <input
                    type="date"
                    value={newHotelReservation.checkOut}
                    onChange={(e)=>setNewHotelReservation({ ...newHotelReservation, checkOut: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={3}
                  value={newHotelReservation.notes}
                  onChange={(e)=>setNewHotelReservation({ ...newHotelReservation, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Any special instructions"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={()=>setShowHotelReservationModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateHotelReservation} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Create</button>
            </div>
          </div>
        </div>
      )}
      {showRevenueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Revenue Details</h2>
                <button
                  onClick={() => setShowRevenueModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-end">
                <select
                  value={revenuePeriod}
                  onChange={(e) => setRevenuePeriod(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
            
            <div className="p-6">
              {revenueDetailsLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading revenue details...</p>
                </div>
              ) : revenueDetails && revenueDetails.length > 0 ? (
                <div className="space-y-4">
                  {/* Timeline Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Revenue Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                      <div className="min-w-[120px]">
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-xl font-bold text-primary break-words">
                          {formatPrice(revenueDetails.reduce((sum: number, item: any) => sum + item.total, 0))}
                        </p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-sm text-gray-600">From Orders</p>
                        <p className="text-xl font-bold text-blue-600 break-words">
                          {formatPrice(revenueDetails
                            .filter((item: any) => !item.type || item.type === 'order')
                            .reduce((sum: number, item: any) => sum + item.total, 0))}
                        </p>
                        <p className="text-xs text-gray-500">
                          {revenueDetails.filter((item: any) => !item.type || item.type === 'order').length} orders
                        </p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-sm text-gray-600">From Appointments</p>
                        <p className="text-xl font-bold text-purple-600 break-words">
                          {formatPrice(revenueDetails
                            .filter((item: any) => item.type === 'appointment')
                            .reduce((sum: number, item: any) => sum + item.total, 0))}
                        </p>
                        <p className="text-xs text-gray-500">
                          {revenueDetails.filter((item: any) => item.type === 'appointment').length} appointments
                        </p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-sm text-gray-600">From Hotel</p>
                        <p className="text-xl font-bold text-indigo-600 break-words">
                          {formatPrice(revenueDetails
                            .filter((item: any) => item.type === 'hotel')
                            .reduce((sum: number, item: any) => sum + item.total, 0))}
                        </p>
                        <p className="text-xs text-gray-500">
                          {revenueDetails.filter((item: any) => item.type === 'hotel').length} reservations
                        </p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-sm text-gray-600">Total Transactions</p>
                        <p className="text-2xl font-bold text-gray-900">{revenueDetails.length}</p>
                      </div>
                    </div>
                    
                    {/* Delivery Method Breakdown */}
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Revenue by Delivery Method</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">🚚 Delivery</p>
                          <p className="text-lg font-bold text-blue-600">
                            {formatPrice(revenueDetails
                              .filter((o: any) => o.deliveryMethod === 'delivery')
                              .reduce((sum: number, order: any) => sum + order.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((o: any) => o.deliveryMethod === 'delivery').length} orders
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">🏪 Pickup</p>
                          <p className="text-lg font-bold text-purple-600">
                            {formatPrice(revenueDetails
                              .filter((o: any) => o.deliveryMethod === 'pickup')
                              .reduce((sum: number, order: any) => sum + order.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((o: any) => o.deliveryMethod === 'pickup').length} orders
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">🏬 In-Store</p>
                          <p className="text-lg font-bold text-orange-600">
                            {formatPrice(revenueDetails
                              .filter((o: any) => o.deliveryMethod === 'instore')
                              .reduce((sum: number, order: any) => sum + order.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((o: any) => o.deliveryMethod === 'instore').length} orders
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Breakdown - Appointments */}
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Appointment Revenue by Payment Method</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">💵 Cash</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatPrice(revenueDetails
                              .filter((item: any) => item.type === 'appointment' && item.paymentMethod === 'cash')
                              .reduce((sum: number, item: any) => sum + item.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((item: any) => item.type === 'appointment' && item.paymentMethod === 'cash').length} appointments
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">📱 Click</p>
                          <p className="text-lg font-bold text-indigo-600">
                            {formatPrice(revenueDetails
                              .filter((item: any) => item.type === 'appointment' && item.paymentMethod === 'click')
                              .reduce((sum: number, item: any) => sum + item.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((item: any) => item.type === 'appointment' && item.paymentMethod === 'click').length} appointments
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">💳 Visa</p>
                          <p className="text-lg font-bold text-violet-600">
                            {formatPrice(revenueDetails
                              .filter((item: any) => item.type === 'appointment' && item.paymentMethod === 'visa')
                              .reduce((sum: number, item: any) => sum + item.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((item: any) => item.type === 'appointment' && item.paymentMethod === 'visa').length} appointments
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Breakdown - Orders */}
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Order Revenue by Payment Method</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">💵 Cash</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatPrice(revenueDetails
                          .filter((item: any) => (!item.type || item.type === 'order') && item.paymentMethod === 'cash')
                            .reduce((sum: number, item: any) => sum + item.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((item: any) => (!item.type || item.type === 'order') && item.paymentMethod === 'cash').length} orders
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">📱 Click</p>
                          <p className="text-lg font-bold text-indigo-600">
                            {formatPrice(revenueDetails
                              .filter((item: any) => (!item.type || item.type === 'order') && item.paymentMethod === 'click')
                              .reduce((sum: number, item: any) => sum + item.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((item: any) => (!item.type || item.type === 'order') && item.paymentMethod === 'click').length} orders
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">💳 Card</p>
                          <p className="text-lg font-bold text-violet-600">
                            {formatPrice(revenueDetails
                              .filter((item: any) => (!item.type || item.type === 'order') && item.paymentMethod === 'visa')
                              .reduce((sum: number, item: any) => sum + item.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((item: any) => (!item.type || item.type === 'order') && item.paymentMethod === 'visa').length} orders
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Breakdown - Hotel */}
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Hotel Reservation Revenue by Payment Method</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">💵 Cash</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatPrice(revenueDetails
                              .filter((item: any) => item.type === 'hotel' && item.paymentMethod === 'cash')
                              .reduce((sum: number, item: any) => sum + item.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((item: any) => item.type === 'hotel' && item.paymentMethod === 'cash').length} reservations
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">📱 Click</p>
                          <p className="text-lg font-bold text-indigo-600">
                            {formatPrice(revenueDetails
                              .filter((item: any) => item.type === 'hotel' && item.paymentMethod === 'click')
                              .reduce((sum: number, item: any) => sum + item.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((item: any) => item.type === 'hotel' && item.paymentMethod === 'click').length} reservations
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">💳 Card</p>
                          <p className="text-lg font-bold text-violet-600">
                            {formatPrice(revenueDetails
                              .filter((item: any) => item.type === 'hotel' && item.paymentMethod === 'card')
                              .reduce((sum: number, item: any) => sum + item.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((item: any) => item.type === 'hotel' && item.paymentMethod === 'card').length} reservations
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Total Payment Method Breakdown */}
                    <div className="mt-4 pt-4 border-t-2 border-gray-400">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Total Revenue by Payment Method</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-3 border-2 border-green-200">
                          <p className="text-xs text-gray-600 mb-1">💵 Cash</p>
                          <p className="text-lg font-bold text-green-700">
                            {formatPrice(revenueDetails
                              .filter((item: any) => item.paymentMethod === 'cash')
                              .reduce((sum: number, item: any) => sum + item.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((item: any) => item.paymentMethod === 'cash').length} transactions
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border-2 border-indigo-200">
                          <p className="text-xs text-gray-600 mb-1">📱 Click</p>
                          <p className="text-lg font-bold text-indigo-700">
                            {formatPrice(revenueDetails
                              .filter((item: any) => item.paymentMethod === 'click')
                              .reduce((sum: number, item: any) => sum + item.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((item: any) => item.paymentMethod === 'click').length} transactions
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border-2 border-violet-200">
                          <p className="text-xs text-gray-600 mb-1">💳 Visa</p>
                          <p className="text-lg font-bold text-violet-700">
                            {formatPrice(revenueDetails
                              .filter((item: any) => item.paymentMethod === 'visa')
                              .reduce((sum: number, item: any) => sum + item.total, 0))}
                          </p>
                          <p className="text-xs text-gray-500">
                            {revenueDetails.filter((item: any) => item.paymentMethod === 'visa').length} transactions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products Sold Summary */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Products Sold</h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(() => {
                            // Aggregate products sold across all orders
                            const productMap = new Map();
                            revenueDetails.forEach((order: any) => {
                              if (order.orderItems) {
                                order.orderItems.forEach((item: any) => {
                                  const key = item.product.name;
                                  if (productMap.has(key)) {
                                    const existing = productMap.get(key);
                                    productMap.set(key, {
                                      ...existing,
                                      quantity: existing.quantity + item.quantity,
                                      total: existing.total + (item.price * item.quantity),
                                    });
                                  } else {
                                    productMap.set(key, {
                                      name: item.product.name,
                                      image: item.product.image,
                                      quantity: item.quantity,
                                      price: item.price,
                                      total: item.price * item.quantity,
                                    });
                                  }
                                });
                              }
                            });
                            return Array.from(productMap.values())
                              .sort((a, b) => b.total - a.total)
                              .map((product, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      {product.image && (
                                        <Image
                                          src={product.image.includes(',') ? product.image.split(',')[0] : product.image}
                                          alt={product.name}
                                          width={40}
                                          height={40}
                                          className="rounded-md mr-3"
                                        />
                                      )}
                                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.quantity}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatPrice(product.price)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatPrice(product.total)}
                                  </td>
                                </tr>
                              ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Detailed Order Timeline */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Revenue Timeline</h3>
                    <div className="space-y-3">
                      {revenueDetails.map((item: any) => (
                        <div key={item.id} onClick={() => { setSelectedRevenueItem(item); setShowRevenueItemDetails(true); }} className={`bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors ${item.type === 'appointment' ? 'border-l-4 border-purple-500' : item.type === 'hotel' ? 'border-l-4 border-indigo-500' : ''}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {item.type === 'appointment' ? (
                                  <>
                                    <span className="text-sm font-semibold text-purple-900">
                                      📅 Appointment
                                    </span>
                                    <span className="text-xs text-purple-600">
                                      {item.petName}
                                    </span>
                                  </>
                                ) : item.type === 'hotel' ? (
                                  <>
                                    <span className="text-sm font-semibold text-indigo-900">
                                      🏨 Hotel Reservation
                                    </span>
                                    <span className="text-xs text-indigo-600">
                                      {item.roomType} #{item.roomNumber} - {item.petName}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm font-semibold text-gray-900">
                                    Order #{item.id.slice(-8)}
                                  </span>
                                )}
                                <span className="text-sm text-gray-600">
                                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    item.status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : item.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{item.customerName} • {item.customerPhone}</p>
                              {item.type === 'appointment' ? (
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-xs text-gray-600">
                                    📅 {new Date(item.appointmentDate).toLocaleDateString()} at {item.appointmentTime}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    item.paymentMethod === 'cash'
                                      ? 'bg-green-100 text-green-800'
                                      : item.paymentMethod === 'click'
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : 'bg-violet-100 text-violet-800'
                                  }`}>
                                    {item.paymentMethod === 'cash' ? '💵 Cash' : item.paymentMethod === 'click' ? '📱 Click' : '💳 Visa'}
                                  </span>
                                  {item.reason && (
                                    <span className="text-xs text-gray-600">
                                      {item.reason}
                                    </span>
                                  )}
                                </div>
                              ) : item.type === 'hotel' ? (
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-xs text-gray-600">
                                    🏨 {new Date(item.checkIn).toLocaleDateString()} → {new Date(item.checkOut).toLocaleDateString()}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    item.paymentMethod === 'cash'
                                      ? 'bg-green-100 text-green-800'
                                      : item.paymentMethod === 'click'
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : 'bg-violet-100 text-violet-800'
                                  }`}>
                                    {item.paymentMethod === 'cash' ? '💵 Cash' : item.paymentMethod === 'click' ? '📱 Click' : '💳 Card'}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    item.deliveryMethod === 'delivery'
                                      ? 'bg-blue-100 text-blue-800'
                                      : item.deliveryMethod === 'pickup'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-orange-100 text-orange-800'
                                  }`}>
                                    {item.deliveryMethod === 'delivery' ? '🚚 Delivery' : item.deliveryMethod === 'pickup' ? '🏪 Pickup' : '🏬 In-Store'}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    item.paymentMethod === 'cash'
                                      ? 'bg-green-100 text-green-800'
                                      : item.paymentMethod === 'click'
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : 'bg-violet-100 text-violet-800'
                                  }`}>
                                    {item.paymentMethod === 'cash' ? '💵 Cash' : item.paymentMethod === 'click' ? '📱 Click' : '💳 Visa'}
                                  </span>
                                </div>
                              )}
                              {item.orderItems && item.orderItems.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500">Items:</p>
                                  <ul className="list-disc list-inside text-sm text-gray-600">
                                    {item.orderItems.map((orderItem: any, idx: number) => (
                                      <li key={idx}>
                                        {orderItem.quantity}x {orderItem.product.name}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">{formatPrice(item.total)}</p>
                              {item.type === 'appointment' && (
                                <p className="text-xs text-purple-600 mt-1">Appointment</p>
                              )}
                              {item.type === 'hotel' && (
                                <p className="text-xs text-indigo-600 mt-1">Hotel</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No revenue details available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Order Modal */}
      {showAddOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add New Order</h2>
              <button
                onClick={() => setShowAddOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={newOrderData.customerName}
                      onChange={(e) => {
                        const searchValue = e.target.value;
                        setNewOrderData({ ...newOrderData, customerName: searchValue, searchCustomer: searchValue });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                    {/* Show suggestions below */}
                    {newOrderData.searchCustomer && newOrderData.searchCustomer.length > 1 && (() => {
                      const suggestions = users.filter(user => 
                        (user.name?.toLowerCase().includes(newOrderData.searchCustomer.toLowerCase()) ||
                         user.phone?.includes(newOrderData.searchCustomer))
                      );
                      return suggestions.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                          {suggestions.slice(0, 5).map(user => (
                            <div
                              key={user.id}
                              onClick={() => {
                                setNewOrderData({
                                  ...newOrderData,
                                  customerName: user.name || '',
                                  customerPhone: user.phone || '',
                                  governorate: user.governorate || '',
                                  area: user.area || '',
                                  customerAddress: user.address || '',
                                  searchCustomer: ''
                                });
                              }}
                              className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-0"
                            >
                              <div className="font-medium">{user.name}</div>
                              {user.phone && <div className="text-xs text-gray-500">{user.phone}</div>}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={newOrderData.customerPhone}
                      onChange={(e) => {
                        const searchValue = e.target.value;
                        setNewOrderData({ ...newOrderData, customerPhone: searchValue, searchCustomer: searchValue });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                    {/* Show suggestions below */}
                    {newOrderData.searchCustomer && newOrderData.searchCustomer.length > 1 && (() => {
                      const suggestions = users.filter(user => 
                        user.phone?.includes(newOrderData.searchCustomer) ||
                        user.name?.toLowerCase().includes(newOrderData.searchCustomer.toLowerCase())
                      );
                      return suggestions.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                          {suggestions.slice(0, 5).map(user => (
                            <div
                              key={user.id}
                              onClick={() => {
                                setNewOrderData({
                                  ...newOrderData,
                                  customerName: user.name || '',
                                  customerPhone: user.phone || '',
                                  governorate: user.governorate || '',
                                  area: user.area || '',
                                  customerAddress: user.address || '',
                                  searchCustomer: ''
                                });
                              }}
                              className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-0"
                            >
                              <div className="font-medium">{user.name}</div>
                              {user.phone && <div className="text-xs text-gray-500">{user.phone}</div>}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Governorate {newOrderData.deliveryMethod === 'delivery' ? '*' : '(Optional)'}
                    </label>
                    <select
                      value={newOrderData.governorate}
                      onChange={(e) => setNewOrderData({ ...newOrderData, governorate: e.target.value, area: '' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select Governorate</option>
                      {Object.keys(governorates).map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>
                  </div>
                  {newOrderData.governorate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area {newOrderData.deliveryMethod === 'delivery' ? '*' : '(Optional)'}
                      </label>
                      <select
                        value={newOrderData.area}
                        onChange={(e) => setNewOrderData({ ...newOrderData, area: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select Area</option>
                        {governorates[newOrderData.governorate as keyof typeof governorates]?.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address {newOrderData.deliveryMethod === 'delivery' ? '*' : '(Optional)'}
                    </label>
                    <textarea
                      value={newOrderData.customerAddress}
                      onChange={(e) => setNewOrderData({ ...newOrderData, customerAddress: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder={newOrderData.deliveryMethod === 'delivery' ? 'Required for delivery orders' : 'Optional for pickup/in-store orders'}
                    />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method *</label>
                    <select
                      value={newOrderData.deliveryMethod}
                      onChange={(e) => setNewOrderData({ ...newOrderData, deliveryMethod: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    >
                      <option value="instore">In-Store</option>
                      <option value="pickup">Pickup</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                                         <select
                       value={newOrderData.paymentMethod}
                       onChange={(e) => setNewOrderData({ ...newOrderData, paymentMethod: e.target.value as 'cash' | 'visa' | 'click' })}
                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                     >
                       <option value="cash">Cash</option>
                       <option value="visa">Visa/Mastercard</option>
                       <option value="click">Click</option>
                     </select>
                   </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      value={newOrderData.status}
                      onChange={(e) => setNewOrderData({ ...newOrderData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={newOrderData.notes}
                    onChange={(e) => setNewOrderData({ ...newOrderData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Add Products */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Products</h3>
                <div className="flex gap-4">
                  <select
                    value={selectedProductForOrder}
                    onChange={(e) => setSelectedProductForOrder(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select a product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {formatPrice(product.price)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="Qty"
                  />
                  <button
                    onClick={handleAddProductToOrder}
                    disabled={!selectedProductForOrder}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Order Items */}
              {newOrderData.items.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {newOrderData.items.map((item, index) => {
                          const product = products.find(p => p.id === item.productId);
                          return (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{product?.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{formatPrice(item.price)}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleRemoveProductFromOrder(index)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">Subtotal</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatPrice(newOrderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</td>
                          <td></td>
                        </tr>
                        {newOrderData.deliveryMethod === 'delivery' && (
                          <tr>
                            <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">Delivery Fee</td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatPrice(3)}</td>
                            <td></td>
                          </tr>
                        )}
                        <tr className="border-t-2 border-gray-300">
                          <td colSpan={3} className="px-4 py-3 text-lg font-bold text-gray-900 text-right">Total</td>
                          <td className="px-4 py-3 text-lg font-bold text-primary">{formatPrice(calculateOrderTotal())}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowAddOrderModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitOrder}
                  disabled={newOrderData.items.length === 0}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400"
                >
                  Add Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => {
                    setShowUserDetailsModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-gray-900">{selectedUser.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-900">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Governorate</p>
                    <p className="text-gray-900">{selectedUser.governorate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Area</p>
                    <p className="text-gray-900">{selectedUser.area || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-gray-900">{selectedUser.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Pets ({selectedUser.pets?.length || 0})</h3>
                  <button
                    onClick={() => {
                      setNewPetData({ ...newPetData, userId: selectedUser.id });
                      setShowAddPetModal(true);
                    }}
                    className="text-sm bg-primary text-white px-3 py-1 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    + Add Pet
                  </button>
                </div>
                {selectedUser.pets && selectedUser.pets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUser.pets.map((pet: any) => (
                      <div 
                        key={pet.id} 
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => fetchPetDetails(pet.id)}
                      >
                        <p className="font-medium text-gray-900">{pet.name} ({pet.species})</p>
                        <p className="text-sm text-gray-600">Code: {pet.petCode}</p>
                        <p className="text-sm text-gray-600">Breed: {pet.breed}</p>
                        <p className="text-xs text-primary mt-2">Click to view details →</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">No pets registered yet.</p>
                )}
              </div>

              {selectedUser.appointments && selectedUser.appointments.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Latest Appointments ({selectedUser.appointments.length})</h3>
                  <div className="space-y-3">
                    {selectedUser.appointments.slice(0, 5).map((appointment: any) => (
                      <div key={appointment.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.petName || 'General Appointment'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            appointment.status === 'upcoming'
                              ? 'bg-blue-100 text-blue-800'
                              : appointment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.orders && selectedUser.orders.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Latest Orders ({selectedUser.orders.length})</h3>
                  <div className="space-y-3">
                    {selectedUser.orders.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => handleEditUser(selectedUser)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit User Profile</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  id="editName"
                  value={editUserData.name}
                  onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="editPhone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  id="editPhone"
                  value={editUserData.phone}
                  onChange={(e) => setEditUserData({ ...editUserData, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="editGovernorate" className="block text-sm font-medium text-gray-700 mb-2">Governorate</label>
                <select
                  id="editGovernorate"
                  value={editUserData.governorate}
                  onChange={(e) => {
                    setEditUserData({ ...editUserData, governorate: e.target.value, area: '' });
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Governorate</option>
                  {Object.keys(governorates).map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>
              {editUserData.governorate && (
                <div>
                  <label htmlFor="editArea" className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                  <select
                    id="editArea"
                    value={editUserData.area}
                    onChange={(e) => setEditUserData({ ...editUserData, area: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Area</option>
                    {governorates[editUserData.governorate as keyof typeof governorates]?.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label htmlFor="editAddress" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  id="editAddress"
                  value={editUserData.address}
                  onChange={(e) => setEditUserData({ ...editUserData, address: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={handleSaveUser}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingUser(null);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pet Details Modal */}
      {showPetDetailsModal && selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Pet Details</h2>
                <button
                  onClick={() => {
                    setShowPetDetailsModal(false);
                    setSelectedPet(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-gray-900">{selectedPet.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pet Code</p>
                    <p className="text-gray-900">{selectedPet.petCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Species</p>
                    <p className="text-gray-900">{selectedPet.species}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Breed</p>
                    <p className="text-gray-900">{selectedPet.breed || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="text-gray-900">{selectedPet.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Birth Date</p>
                    <p className="text-gray-900">{selectedPet.birthDate ? new Date(selectedPet.birthDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="text-gray-900">{selectedPet.color || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedPet.allergies && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Allergies</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedPet.allergies}</p>
                </div>
              )}

              {selectedPet.medications && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Medications</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedPet.medications}</p>
                </div>
              )}

              {selectedPet.medicalHistory && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Medical History</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedPet.medicalHistory}</p>
                </div>
              )}

              {selectedPet.surgicalHistory && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Surgical History</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedPet.surgicalHistory}</p>
                </div>
              )}

              {selectedPet.chronicConditions && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Chronic Conditions</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedPet.chronicConditions}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => handleEditPet(selectedPet)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Pet
              </button>
              <button
                onClick={() => handleDeletePet(selectedPet.id)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Pet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pet Modal */}
      {showEditPetModal && editingPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Pet Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
                <input
                  type="text"
                  value={editPetData.name}
                  onChange={(e) => setEditPetData({ ...editPetData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
                <input
                  type="text"
                  value={editPetData.species}
                  onChange={(e) => setEditPetData({ ...editPetData, species: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                <input
                  type="text"
                  value={editPetData.breed}
                  onChange={(e) => setEditPetData({ ...editPetData, breed: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={editPetData.gender}
                  onChange={(e) => setEditPetData({ ...editPetData, gender: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                <input
                  type="date"
                  value={editPetData.birthDate}
                  onChange={(e) => setEditPetData({ ...editPetData, birthDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="text"
                  value={editPetData.color}
                  onChange={(e) => setEditPetData({ ...editPetData, color: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                <textarea
                  value={editPetData.allergies}
                  onChange={(e) => setEditPetData({ ...editPetData, allergies: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                <textarea
                  value={editPetData.medications}
                  onChange={(e) => setEditPetData({ ...editPetData, medications: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                <textarea
                  value={editPetData.medicalHistory}
                  onChange={(e) => setEditPetData({ ...editPetData, medicalHistory: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Surgical History</label>
                <textarea
                  value={editPetData.surgicalHistory}
                  onChange={(e) => setEditPetData({ ...editPetData, surgicalHistory: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
                <textarea
                  value={editPetData.chronicConditions}
                  onChange={(e) => setEditPetData({ ...editPetData, chronicConditions: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={handleSavePet}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditPetModal(false);
                  setEditingPet(null);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Owner Modal */}
      {showAddOwnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Owner</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={newOwnerData.name}
                  onChange={(e) => setNewOwnerData({ ...newOwnerData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newOwnerData.email}
                  onChange={(e) => setNewOwnerData({ ...newOwnerData, email: e.target.value })}
                  placeholder="Leave empty for admin-only owner (no account)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">Only required if owner needs to login</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="text"
                  value={newOwnerData.phone}
                  onChange={(e) => setNewOwnerData({ ...newOwnerData, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={newOwnerData.password}
                  onChange={(e) => setNewOwnerData({ ...newOwnerData, password: e.target.value })}
                  placeholder="Leave empty if no account needed"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">Only required if owner needs to login</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Governorate</label>
                <select
                  value={newOwnerData.governorate}
                  onChange={(e) => setNewOwnerData({ ...newOwnerData, governorate: e.target.value, area: '' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Governorate</option>
                  {Object.keys(governorates).map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>
              {newOwnerData.governorate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                  <select
                    value={newOwnerData.area}
                    onChange={(e) => setNewOwnerData({ ...newOwnerData, area: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Area</option>
                    {governorates[newOwnerData.governorate as keyof typeof governorates]?.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={newOwnerData.address}
                  onChange={(e) => setNewOwnerData({ ...newOwnerData, address: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={handleAddOwner}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Owner
              </button>
              <button
                onClick={() => {
                  setShowAddOwnerModal(false);
                  setNewOwnerData({
                    name: '',
                    email: '',
                    phone: '',
                    governorate: '',
                    area: '',
                    address: '',
                    password: '',
                  });
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Pet Modal */}
      {showAddPetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Pet</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name *</label>
                <input
                  type="text"
                  value={newPetData.name}
                  onChange={(e) => setNewPetData({ ...newPetData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Species *</label>
                <input
                  type="text"
                  value={newPetData.species}
                  onChange={(e) => setNewPetData({ ...newPetData, species: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                <input
                  type="text"
                  value={newPetData.breed}
                  onChange={(e) => setNewPetData({ ...newPetData, breed: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={newPetData.gender}
                  onChange={(e) => setNewPetData({ ...newPetData, gender: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                <input
                  type="date"
                  value={newPetData.birthDate}
                  onChange={(e) => setNewPetData({ ...newPetData, birthDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="text"
                  value={newPetData.color}
                  onChange={(e) => setNewPetData({ ...newPetData, color: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={handleAddPet}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Pet
              </button>
              <button
                onClick={() => {
                  setShowAddPetModal(false);
                  setNewPetData({
                    userId: '',
                    name: '',
                    species: '',
                    breed: '',
                    gender: '',
                    birthDate: '',
                    color: '',
                  });
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showAppointmentDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
                <button
                  onClick={() => {
                    setShowAppointmentDetailsModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Appointment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Pet</p>
                    <p className="text-gray-900">{selectedAppointment.petName || 'General Appointment'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                        selectedAppointment.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedAppointment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedAppointment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-gray-900">{new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="text-gray-900">{selectedAppointment.appointmentTime}</p>
                  </div>
                </div>
                {selectedAppointment.reason && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Reason</p>
                    <p className="text-gray-900">{selectedAppointment.reason}</p>
                  </div>
                )}
                {selectedAppointment.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-gray-900">{selectedAppointment.user?.name || selectedAppointment.ownerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{selectedAppointment.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-900">{selectedAppointment.user?.phone || selectedAppointment.ownerPhone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedAppointment.status === 'completed' && (selectedAppointment.completionPrice || selectedAppointment.completionPaymentMethod) && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Completion Details (Admin Only)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg">
                    {selectedAppointment.completionPrice && (
                      <div>
                        <p className="text-sm font-medium text-purple-600">Price Paid</p>
                        <p className="text-lg font-bold text-purple-900">${parseFloat(selectedAppointment.completionPrice).toFixed(2)}</p>
                      </div>
                    )}
                    {selectedAppointment.completionPaymentMethod && (
                      <div>
                        <p className="text-sm font-medium text-purple-600">Payment Method</p>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                            selectedAppointment.completionPaymentMethod === 'cash'
                              ? 'bg-green-100 text-green-800'
                              : selectedAppointment.completionPaymentMethod === 'click'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-violet-100 text-violet-800'
                          }`}
                        >
                          {selectedAppointment.completionPaymentMethod === 'cash' ? '💵 Cash' : selectedAppointment.completionPaymentMethod === 'click' ? '📱 Click' : '💳 Visa'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => handleEditAppointment(selectedAppointment)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Appointment
              </button>
              <button
                onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditAppointmentModal && editingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Appointment</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={editAppointmentData.appointmentDate}
                  onChange={(e) => setEditAppointmentData({ ...editAppointmentData, appointmentDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={editAppointmentData.appointmentTime}
                  onChange={(e) => setEditAppointmentData({ ...editAppointmentData, appointmentTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <input
                  type="text"
                  value={editAppointmentData.reason}
                  onChange={(e) => setEditAppointmentData({ ...editAppointmentData, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={editAppointmentData.notes}
                  onChange={(e) => setEditAppointmentData({ ...editAppointmentData, notes: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editAppointmentData.status}
                  onChange={(e) => setEditAppointmentData({ ...editAppointmentData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              {editAppointmentData.status === 'completed' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Completion Price (Admin Only)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editAppointmentData.completionPrice}
                      onChange={(e) => setEditAppointmentData({ ...editAppointmentData, completionPrice: e.target.value })}
                      placeholder="Enter price"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method (Admin Only)</label>
                    <select
                      value={editAppointmentData.completionPaymentMethod}
                      onChange={(e) => setEditAppointmentData({ ...editAppointmentData, completionPaymentMethod: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Payment Method</option>
                      <option value="cash">Cash</option>
                      <option value="visa">Visa/Mastercard</option>
                      <option value="click">Click</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={handleSaveAppointment}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditAppointmentModal(false);
                  setEditingAppointment(null);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {showAddAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Appointment</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Name {newAppointmentData.userId ? '(Existing User)' : '(New or Existing User)'}
                </label>
                <input
                  type="text"
                  placeholder="Type owner name or phone to search, or enter new owner..."
                  value={newAppointmentData.ownerName}
                  onChange={(e) => {
                    setNewAppointmentData({ ...newAppointmentData, ownerName: e.target.value, userId: '', searchOwner: e.target.value });
                    setSelectedOwnerPets([]);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {/* Show suggestions when typing */}
                {newAppointmentData.ownerName && newAppointmentData.ownerName.length >= 2 && !newAppointmentData.userId && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {users
                      .filter(user => 
                        (user.name && user.name.toLowerCase().includes(newAppointmentData.ownerName!.toLowerCase())) ||
                        (user.phone && user.phone.includes(newAppointmentData.ownerName!))
                      )
                      .slice(0, 5)
                      .map((user) => (
                        <div
                          key={user.id}
                          onClick={() => {
                            handleOwnerChange(user.id);
                            setNewAppointmentData({ ...newAppointmentData, ownerName: user.name || user.email || '', userId: user.id, searchOwner: '' });
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                        >
                          <div className="font-medium">{user.name || user.email}</div>
                          {user.phone && <div className="text-sm text-gray-500">{user.phone}</div>}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              {/* Phone Number Field - Only shown if no existing user selected */}
              {!newAppointmentData.userId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newAppointmentData.ownerPhone}
                    onChange={(e) => setNewAppointmentData({ ...newAppointmentData, ownerPhone: e.target.value })}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
              {newAppointmentData.userId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet</label>
                  <select
                    value={newAppointmentData.petId}
                    onChange={(e) => handlePetChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">General Appointment (No Pet)</option>
                    {selectedOwnerPets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} ({pet.species})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={newAppointmentData.appointmentDate}
                  onChange={(e) => setNewAppointmentData({ ...newAppointmentData, appointmentDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                <input
                  type="time"
                  value={newAppointmentData.appointmentTime}
                  onChange={(e) => setNewAppointmentData({ ...newAppointmentData, appointmentTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                <input
                  type="text"
                  value={newAppointmentData.reason}
                  onChange={(e) => setNewAppointmentData({ ...newAppointmentData, reason: e.target.value })}
                  placeholder="e.g., Checkup, Vaccination, Surgery"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newAppointmentData.notes}
                  onChange={(e) => setNewAppointmentData({ ...newAppointmentData, notes: e.target.value })}
                  rows={4}
                  placeholder="Additional information or special instructions"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={handleAddAppointment}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Appointment
              </button>
              <button
                onClick={() => {
                  setShowAddAppointmentModal(false);
                  setNewAppointmentData({
                    userId: '',
                    ownerName: '',
                    ownerPhone: '',
                    petId: '',
                    petName: '',
                    searchOwner: '',
                    appointmentDate: '',
                    appointmentTime: '',
                    reason: '',
                    notes: '',
                  });
                  setSelectedOwnerPets([]);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Item Details Modal */}
      {showRevenueItemDetails && selectedRevenueItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedRevenueItem.type === 'appointment' && '📅 Appointment Details'}
                {selectedRevenueItem.type === 'hotel' && '🏨 Hotel Reservation Details'}
                {(!selectedRevenueItem.type || selectedRevenueItem.type === 'order') && '📦 Order Details'}
              </h2>
              <button onClick={() => setShowRevenueItemDetails(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-base font-medium text-gray-900">{selectedRevenueItem.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-base font-medium text-gray-900">{selectedRevenueItem.customerPhone}</p>
                  </div>
                </div>
              </div>

              {selectedRevenueItem.type === 'appointment' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Appointment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Pet Name</p>
                      <p className="text-base font-medium text-gray-900">{selectedRevenueItem.petName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="text-base font-medium text-gray-900">{new Date(selectedRevenueItem.appointmentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="text-base font-medium text-gray-900">{selectedRevenueItem.appointmentTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedRevenueItem.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedRevenueItem.status}
                      </span>
                    </div>
                    {selectedRevenueItem.reason && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Reason</p>
                        <p className="text-base font-medium text-gray-900">{selectedRevenueItem.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedRevenueItem.type === 'hotel' && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Reservation Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Room</p>
                      <p className="text-base font-medium text-gray-900">{selectedRevenueItem.roomType} Room #{selectedRevenueItem.roomNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pet Name</p>
                      <p className="text-base font-medium text-gray-900">{selectedRevenueItem.petName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="text-base font-medium text-gray-900">{new Date(selectedRevenueItem.checkIn).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="text-base font-medium text-gray-900">{new Date(selectedRevenueItem.checkOut).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedRevenueItem.status === 'checked_out' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedRevenueItem.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {(!selectedRevenueItem.type || selectedRevenueItem.type === 'order') && (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="text-base font-medium text-gray-900">#{selectedRevenueItem.id.slice(-8)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedRevenueItem.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          selectedRevenueItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedRevenueItem.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Delivery Method</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedRevenueItem.deliveryMethod === 'delivery' ? 'bg-blue-100 text-blue-800' :
                          selectedRevenueItem.deliveryMethod === 'pickup' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {selectedRevenueItem.deliveryMethod === 'delivery' ? '🚚 Delivery' :
                           selectedRevenueItem.deliveryMethod === 'pickup' ? '🏪 Pickup' : '🏬 In-Store'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedRevenueItem.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' :
                          selectedRevenueItem.paymentMethod === 'click' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-violet-100 text-violet-800'
                        }`}>
                          {selectedRevenueItem.paymentMethod === 'cash' ? '💵 Cash' :
                           selectedRevenueItem.paymentMethod === 'click' ? '📱 Click' : '💳 Visa'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedRevenueItem.orderItems && selectedRevenueItem.orderItems.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                      <div className="space-y-2">
                        {selectedRevenueItem.orderItems.map((orderItem: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center border-b pb-2">
                            <div className="flex items-center gap-3">
                              {orderItem.product.image && (
                                <Image
                                  src={orderItem.product.image.includes(',') ? orderItem.product.image.split(',')[0] : orderItem.product.image}
                                  alt={orderItem.product.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                />
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">{orderItem.product.name}</p>
                                <p className="text-xs text-gray-500">Quantity: {orderItem.quantity}</p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{formatPrice(orderItem.price * orderItem.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
                
                {/* Payment Breakdown for Hotel Reservations */}
                {selectedRevenueItem.type === 'hotel' && (selectedRevenueItem.roomRate || selectedRevenueItem.subtotal) && (
                  <div className="mb-4 bg-white rounded-lg p-4 border border-green-300">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Payment Breakdown</h4>
                    <div className="space-y-2">
                      {selectedRevenueItem.roomRate && selectedRevenueItem.totalNights && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Room Rate ({selectedRevenueItem.totalNights} night{selectedRevenueItem.totalNights !== 1 ? 's' : ''} × {formatPrice(selectedRevenueItem.roomRate)})</span>
                          <span className="font-medium">{formatPrice((selectedRevenueItem.totalNights || 0) * (selectedRevenueItem.roomRate || 0))}</span>
                        </div>
                      )}
                      {selectedRevenueItem.pickup && selectedRevenueItem.pickupFee && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Pickup Service</span>
                          <span className="font-medium">{formatPrice(selectedRevenueItem.pickupFee)}</span>
                        </div>
                      )}
                      {selectedRevenueItem.dropoff && selectedRevenueItem.dropoffFee && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Drop-off Service</span>
                          <span className="font-medium">{formatPrice(selectedRevenueItem.dropoffFee)}</span>
                        </div>
                      )}
                      {selectedRevenueItem.extraServices && Array.isArray(selectedRevenueItem.extraServices) && selectedRevenueItem.extraServices.map((extra: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{extra.reason}</span>
                          <span className="font-medium">{formatPrice(extra.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">{formatPrice(selectedRevenueItem.total)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedRevenueItem.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' :
                      selectedRevenueItem.paymentMethod === 'click' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-violet-100 text-violet-800'
                    }`}>
                      {selectedRevenueItem.paymentMethod === 'cash' ? '💵 Cash' :
                       selectedRevenueItem.paymentMethod === 'click' ? '📱 Click' : '💳 Card'}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-base font-medium text-gray-900">
                      {new Date(selectedRevenueItem.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button onClick={() => setShowRevenueItemDetails(false)} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Card Details Modal */}
      {showAnalyticsDetailsModal && selectedAnalyticsType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedAnalyticsType === 'appointments' && '📅 All Appointments'}
                {selectedAnalyticsType === 'hotel' && '🏨 All Hotel Reservations'}
                {selectedAnalyticsType === 'orders' && '📦 All Orders'}
              </h2>
              <button onClick={() => setShowAnalyticsDetailsModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6">
              {selectedAnalyticsType === 'orders' && orders && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No orders found</p>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</p>
                            <p className="text-sm text-gray-600">{order.customerName} ({order.customerPhone})</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Total</p>
                            <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Payment</p>
                            <p className="font-semibold text-gray-900 capitalize">{order.paymentMethod}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Delivery</p>
                            <p className="font-semibold text-gray-900 capitalize">{order.deliveryMethod}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Date</p>
                            <p className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {order.orderItems && order.orderItems.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Order Items:</p>
                            <div className="space-y-2">
                              {order.orderItems.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between bg-white rounded p-2">
                                  <div className="flex items-center gap-3">
                                    {item.product.image && (
                                      <Image
                                        src={item.product.image.includes(',') ? item.product.image.split(',')[0] : item.product.image}
                                        alt={item.product.name}
                                        width={40}
                                        height={40}
                                        className="rounded-md"
                                      />
                                    )}
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <p className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {selectedAnalyticsType === 'appointments' && appointments && (
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No appointments found</p>
                  ) : (
                    appointments.map((appointment) => (
                      <div key={appointment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{appointment.user?.name || appointment.ownerName || 'N/A'}</p>
                            <p className="text-sm text-gray-600">{appointment.user?.phone || appointment.ownerPhone || 'N/A'}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Pet</p>
                            <p className="font-semibold text-gray-900">{appointment.pet?.name || appointment.petName || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Date</p>
                            <p className="font-semibold text-gray-900">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Time</p>
                            <p className="font-semibold text-gray-900">{appointment.appointmentTime}</p>
                          </div>
                          {appointment.completionPrice && (
                            <div>
                              <p className="text-gray-600">Amount</p>
                              <p className="font-semibold text-gray-900">{formatPrice(appointment.completionPrice)}</p>
                            </div>
                          )}
                        </div>
                        {appointment.reason && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">Reason</p>
                            <p className="text-sm font-medium text-gray-900">{appointment.reason}</p>
                          </div>
                        )}
                        {appointment.notes && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">Notes</p>
                            <p className="text-sm font-medium text-gray-900">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {selectedAnalyticsType === 'hotel' && hotelReservations && (
                <div className="space-y-4">
                  {hotelReservations.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No hotel reservations found</p>
                  ) : (
                    hotelReservations.map((reservation) => (
                      <div key={reservation.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{reservation.user?.name || reservation.ownerName || 'N/A'}</p>
                            <p className="text-sm text-gray-600">{reservation.user?.phone || reservation.ownerPhone || 'N/A'}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            reservation.status === 'checked_out' ? 'bg-green-100 text-green-800' :
                            reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            reservation.status === 'checked_in' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {reservation.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Room</p>
                            <p className="font-semibold text-gray-900">{reservation.room?.type} #{reservation.room?.roomNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Pet</p>
                            <p className="font-semibold text-gray-900">{reservation.pet?.name || reservation.petName || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Check-in</p>
                            <p className="font-semibold text-gray-900">{new Date(reservation.checkIn).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Check-out</p>
                            <p className="font-semibold text-gray-900">{new Date(reservation.checkOut).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {reservation.total && (
                          <div className="mt-2 pt-2 border-t border-gray-300">
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="text-lg font-bold text-green-600">{formatPrice(reservation.total)}</p>
                          </div>
                        )}
                        {reservation.notes && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">Notes</p>
                            <p className="text-sm font-medium text-gray-900">{reservation.notes}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button onClick={() => setShowAnalyticsDetailsModal(false)} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
