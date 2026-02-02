import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch a single pet by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pet = await prisma.pet.findUnique({
      where: { id: params.id },
    });

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }

    return NextResponse.json({ pet });
  } catch (error) {
    console.error('Error fetching pet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update a pet
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, species, breed, gender, birthDate, color, photo, allergies, medications, medicalHistory, surgicalHistory, chronicConditions } = body;

    const pet = await prisma.pet.update({
      where: { id: params.id },
      data: {
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

    return NextResponse.json({ pet });
  } catch (error) {
    console.error('Error updating pet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a pet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.pet.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

