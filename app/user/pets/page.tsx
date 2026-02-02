'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function UserPetsPage() {
  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    birthDate: '',
    color: '',
    photo: null as File | null,
    photoUrl: '',
    allergies: '',
    medications: '',
    medicalHistory: '',
    surgicalHistory: '',
    chronicConditions: '',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/user');
      return;
    }
    
    const userData = JSON.parse(userStr);
    setUser(userData);
    fetchPets(userData.id);
  }, [router]);

  const fetchPets = async (userId: string) => {
    try {
      const response = await fetch(`/api/pets?userId=${userId}`);
      const data = await response.json();
      setPets(data.pets);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload photo if provided
    let photoUrl = formData.photoUrl;
    if (formData.photo) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.photo);
        uploadFormData.append('folder', 'eagles-vet/pets');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const uploadData = await uploadResponse.json();
        photoUrl = uploadData.url;
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo');
        return;
      }
    }

    const petData = {
      userId: user.id,
      name: formData.name,
      species: formData.species,
      breed: formData.breed,
      gender: formData.gender,
      birthDate: formData.birthDate || null,
      color: formData.color,
      photo: photoUrl,
      allergies: formData.allergies || null,
      medications: formData.medications || null,
      medicalHistory: formData.medicalHistory || null,
      surgicalHistory: formData.surgicalHistory || null,
      chronicConditions: formData.chronicConditions || null,
    };

    try {
      if (editingPet) {
        // Update pet
        await fetch(`/api/pets/${editingPet.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(petData),
        });
      } else {
        // Create new pet
        await fetch('/api/pets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(petData),
        });
      }

      // Reset form and close modal
      setFormData({
        name: '',
        species: '',
        breed: '',
        gender: '',
        birthDate: '',
        color: '',
        photo: null,
        photoUrl: '',
        allergies: '',
        medications: '',
        medicalHistory: '',
        surgicalHistory: '',
        chronicConditions: '',
      });
      setEditingPet(null);
      setShowAddModal(false);
      fetchPets(user.id);
    } catch (error) {
      console.error('Error saving pet:', error);
      alert('Failed to save pet');
    }
  };

  const handleEdit = (pet: any) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      gender: pet.gender,
      birthDate: pet.birthDate ? new Date(pet.birthDate).toISOString().split('T')[0] : '',
      color: pet.color || '',
      photo: null,
      photoUrl: pet.photo || '',
      allergies: pet.allergies || '',
      medications: pet.medications || '',
      medicalHistory: pet.medicalHistory || '',
      surgicalHistory: pet.surgicalHistory || '',
      chronicConditions: pet.chronicConditions || '',
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pet?')) return;

    try {
      await fetch(`/api/pets/${id}`, { method: 'DELETE' });
      fetchPets(user.id);
    } catch (error) {
      console.error('Error deleting pet:', error);
      alert('Failed to delete pet');
    }
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setEditingPet(null);
    setFormData({
      name: '',
      species: '',
      breed: '',
      gender: '',
      birthDate: '',
      color: '',
      photo: null,
      photoUrl: '',
      allergies: '',
      medications: '',
      medicalHistory: '',
      surgicalHistory: '',
      chronicConditions: '',
    });
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
              Add Pet
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Pets</h1>

          {pets.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="text-gray-600 text-lg mb-4">No pets added yet</p>
              <p className="text-gray-500 mb-6">Add your first pet to get started</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Add Your First Pet
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {pet.photo ? (
                    <img src={pet.photo} alt={pet.name} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {pet.petCode}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-semibold">Species:</span> {pet.species}</p>
                      {pet.breed && <p><span className="font-semibold">Breed:</span> {pet.breed}</p>}
                      <p><span className="font-semibold">Gender:</span> {pet.gender}</p>
                      {pet.birthDate && (
                        <p><span className="font-semibold">Birth Date:</span> {new Date(pet.birthDate).toLocaleDateString()}</p>
                      )}
                      {pet.color && <p><span className="font-semibold">Color:</span> {pet.color}</p>}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(pet)}
                        className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pet.id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingPet ? 'Edit Pet' : 'Add New Pet'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Photo
                  </label>
                  {formData.photoUrl && !formData.photo && (
                    <img src={formData.photoUrl} alt="Pet" className="w-32 h-32 object-cover rounded-lg mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setFormData({ ...formData, photo: file });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Species */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Species *
                  </label>
                  <select
                    required
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Species</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Hamster">Hamster</option>
                    <option value="Guinea Pig">Guinea Pig</option>
                    <option value="Fish">Fish</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Breed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color / Markings
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Medical Information Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                  
                  {/* Allergies */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>
                    <textarea
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      rows={2}
                      placeholder="List any known allergies"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Medications */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Medications
                    </label>
                    <textarea
                      value={formData.medications}
                      onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                      rows={2}
                      placeholder="List current medications and dosages"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Medical History */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical History / Past Illnesses
                    </label>
                    <textarea
                      value={formData.medicalHistory}
                      onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                      rows={2}
                      placeholder="Past illnesses, treatments, etc."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Surgical History */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surgical History
                    </label>
                    <textarea
                      value={formData.surgicalHistory}
                      onChange={(e) => setFormData({ ...formData, surgicalHistory: e.target.value })}
                      rows={2}
                      placeholder="Previous surgeries and procedures"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Chronic Conditions */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chronic Conditions
                    </label>
                    <textarea
                      value={formData.chronicConditions}
                      onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                      rows={2}
                      placeholder="e.g. diabetes, arthritis, etc."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    {editingPet ? 'Update Pet' : 'Add Pet'}
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
