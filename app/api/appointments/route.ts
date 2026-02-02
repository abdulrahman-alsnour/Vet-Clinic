import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search'); // Search term for customer name, phone, or pet name
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50'); // Default 50 appointments per page
    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Add search filtering
    if (search) {
      where.OR = [
        { petName: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { phone: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Add date filtering
    if (startDate || endDate) {
      where.appointmentDate = {};
      if (startDate) {
        where.appointmentDate.gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.appointmentDate.lte = end;
      }
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        take: limit,
        skip,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: [
          { appointmentDate: 'desc' },
          { appointmentTime: 'desc' },
        ],
      }),
      prisma.appointment.count({ where }),
    ]);

    // Transform appointments to include ownerName or user name
    const appointmentsWithOwnerName = appointments.map(appointment => ({
      ...appointment,
      ownerName: appointment.ownerName || appointment.user?.name || 'Unknown',
    }));

    return NextResponse.json({ 
      appointments: appointmentsWithOwnerName,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      ownerName,
      ownerPhone,
      petId,
      petName,
      appointmentDate,
      appointmentTime,
      reason,
      notes,
    } = body;

    if ((!userId && !ownerName) || !appointmentDate || !appointmentTime || !reason) {
      return NextResponse.json(
        { error: 'Either userId or ownerName, appointment date, appointment time, and reason are required' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: userId || null,
        ownerName: ownerName || null,
        ownerPhone: ownerPhone || null,
        petId: petId || null,
        petName: petName || null,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        reason,
        notes: notes || null,
        status: 'upcoming',
      },
      ...(userId && {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      }),
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

