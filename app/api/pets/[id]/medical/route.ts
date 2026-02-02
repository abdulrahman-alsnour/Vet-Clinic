import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This route handles vaccination, deworming, clinic visit, and weight record operations
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    let result;

    switch (type) {
      case 'vaccination':
        result = await prisma.vaccination.create({
          data: {
            petId: params.id,
            name: data.name,
            date: new Date(data.date),
            nextDue: data.nextDue ? new Date(data.nextDue) : null,
            notes: data.notes,
          },
        });
        break;

      case 'deworming':
        result = await prisma.deworming.create({
          data: {
            petId: params.id,
            name: data.name,
            date: new Date(data.date),
            nextDue: data.nextDue ? new Date(data.nextDue) : null,
            notes: data.notes,
          },
        });
        break;

      case 'clinicVisit':
        result = await prisma.clinicVisit.create({
          data: {
            petId: params.id,
            visitDate: new Date(data.visitDate),
            reason: data.reason,
            diagnosis: data.diagnosis,
            treatment: data.treatment,
            prescriptions: data.prescriptions,
            notes: data.notes,
            nextAppointment: data.nextAppointment ? new Date(data.nextAppointment) : null,
          },
        });
        break;

      case 'weightRecord':
        result = await prisma.weightRecord.create({
          data: {
            petId: params.id,
            date: new Date(data.date),
            weight: parseFloat(data.weight),
            notes: data.notes,
          },
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating medical record:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Fetch all medical records for a pet
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vaccinations = await prisma.vaccination.findMany({
      where: { petId: params.id },
      orderBy: { date: 'desc' },
    });

    const dewormings = await prisma.deworming.findMany({
      where: { petId: params.id },
      orderBy: { date: 'desc' },
    });

    const clinicVisits = await prisma.clinicVisit.findMany({
      where: { petId: params.id },
      orderBy: { visitDate: 'desc' },
    });

    const weightRecords = await prisma.weightRecord.findMany({
      where: { petId: params.id },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({
      vaccinations,
      dewormings,
      clinicVisits,
      weightRecords,
    });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

