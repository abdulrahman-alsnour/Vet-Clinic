import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;

    const reservations = await prisma.hotelReservation.findMany({
      where: { status },
      include: {
        room: true,
        user: { select: { id: true, name: true, phone: true } },
        pet: { select: { id: true, name: true, species: true } },
      },
      orderBy: { checkIn: 'desc' },
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, userId, ownerName, ownerPhone, petId, petName, checkIn, checkOut, notes, pickup, dropoff, extraServices } = body;

    if (!roomId || !checkIn || !checkOut) {
      return NextResponse.json({ error: 'roomId, checkIn and checkOut are required' }, { status: 400 });
    }
    if (!ownerName || !ownerPhone || !petName) {
      return NextResponse.json({ error: 'Owner name, owner phone, and pet name are required' }, { status: 400 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkOutDate <= checkInDate) {
      return NextResponse.json({ error: 'Invalid check-in/check-out dates' }, { status: 400 });
    }

    // Check room availability for the period (overlap)
    const overlaps = await prisma.hotelReservation.count({
      where: {
        roomId,
        status: { in: ['booked', 'checked_in'] },
        OR: [
          { AND: [{ checkIn: { lt: checkOutDate } }, { checkOut: { gt: checkInDate } }] },
        ],
      },
    });
    if (overlaps > 0) {
      return NextResponse.json({ error: 'Room is not available for the selected dates' }, { status: 409 });
    }

    // Resolve or create user like appointment logic
    let resolvedUserId: string | null = userId || null;
    if (!resolvedUserId && ownerPhone) {
      const existingByPhone = await prisma.user.findFirst({ where: { phone: ownerPhone } });
      if (existingByPhone) {
        resolvedUserId = existingByPhone.id;
      } else if (ownerName) {
        // Create admin-owner user with generated email and dummy hash (no-login) similar to admin users API
        const generatedEmail = `owner-${ownerPhone?.replace(/\D/g, '') || 'nouser'}-${Date.now()}@vetclinic.local`;
        const hashedPassword = await bcrypt.hash('no-login-' + Date.now(), 10);
        const newUser = await prisma.user.create({
          data: {
            email: generatedEmail.toLowerCase(),
            password: hashedPassword,
            name: ownerName,
            phone: ownerPhone,
            role: 'user',
          },
          select: { id: true },
        });
        resolvedUserId = newUser.id;
      }
    }

    const reservation = await prisma.hotelReservation.create({
      data: {
        roomId,
        userId: resolvedUserId,
        ownerName,
        ownerPhone,
        petId: petId || null,
        petName,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        notes: notes || null,
        status: 'booked',
        pickup: !!pickup,
        dropoff: !!dropoff,
        extraServices: extraServices || null,
      },
      include: { room: true, user: { select: { id: true, name: true, phone: true } } },
    });

    // Mark room occupied immediately after booking
    await prisma.hotelRoom.update({ where: { id: roomId }, data: { status: 'OCCUPIED' } });

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

