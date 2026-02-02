'use client';

import { useState } from 'react';
import Image from 'next/image';

const staffMembers = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Chief Veterinarian',
    bio: 'With over 15 years of experience, Dr. Johnson specializes in small animal surgery and has a passion for emergency medicine.',
    image: '/api/placeholder/400/400',
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Senior Veterinarian',
    bio: 'Dr. Chen has expertise in exotic pets and dermatology, bringing innovative treatments to our practice.',
    image: '/api/placeholder/400/400',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Veterinary Nurse',
    bio: 'Emily ensures all our patients receive compassionate care and maintains our state-of-the-art equipment.',
    image: '/api/placeholder/400/400',
  },
  {
    name: 'James Wilson',
    role: 'Animal Behaviorist',
    bio: 'James specializes in behavioral training and helps pets overcome anxiety and develop healthy behaviors.',
    image: '/api/placeholder/400/400',
  },
];

export default function Staff() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % staffMembers.length);
      setIsTransitioning(false);
    }, 200);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + staffMembers.length) % staffMembers.length);
      setIsTransitioning(false);
    }, 200);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 200);
  };

  const currentStaff = staffMembers[currentIndex];

  return (
    <section id="staff" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600">
            Experienced professionals dedicated to your pet&apos;s health
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Staff Card */}
            <div className={`text-center transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-xl">
                <Image
                  src={currentStaff.image}
                  alt={currentStaff.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 192px"
                />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {currentStaff.name}
              </h3>
              <p className="text-xl text-primary mb-6">
                {currentStaff.role}
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {currentStaff.bio}
              </p>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 text-gray-700 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous staff member"
              disabled={isTransitioning}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 text-gray-700 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next staff member"
              disabled={isTransitioning}
            >
              <svg
                className="w-6 h-6"
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
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {staffMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  className={`transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary w-8 h-2'
                      : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
                  } rounded-full disabled:cursor-not-allowed`}
                  aria-label={`Go to staff member ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
