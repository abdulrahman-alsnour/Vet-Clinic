import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all pets for a user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const pets = await prisma.pet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        vaccinations: {
          orderBy: { date: 'desc' },
          take: 5, // Only recent vaccinations
        },
        dewormings: {
          orderBy: { date: 'desc' },
          take: 5, // Only recent dewormings
        },
        clinicVisits: {
          orderBy: { visitDate: 'desc' },
          take: 5, // Only recent visits
        },
        weightHistory: {
          orderBy: { date: 'desc' },
          take: 5, // Last 5 weight records (reduced from 10)
        },
      },
    });

    return NextResponse.json({ pets });
  } catch (error) {
    console.error('Error fetching pets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new pet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, species, breed, gender, birthDate, color, photo, allergies, medications, medicalHistory, surgicalHistory, chronicConditions } = body;

    // Validate required fields
    if (!userId || !name || !species) {
      return NextResponse.json(
        { error: 'UserId, name, and species are required' },
        { status: 400 }
      );
    }

    // Generate unique pet code
    const existingPets = await prisma.pet.count();
    const petCode = `PET-${String(existingPets + 1).padStart(5, '0')}`;

    const pet = await prisma.pet.create({
      data: {
        userId,
        petCode,
        name,
        species,
        breed,
        gender,
        birthDate: birthDate ? new Date(birthDate) : null,
        color,
        photo,
        allergies,
        medications,
        medicalHistory,
        surgicalHistory,
        chronicConditions,
      },
    });

    return NextResponse.json({ pet }, { status: 201 });
  } catch (error) {
    console.error('Error creating pet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

