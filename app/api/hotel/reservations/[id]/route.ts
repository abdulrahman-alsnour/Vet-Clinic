import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const {
      ownerName,
      ownerPhone,
      petName,
      checkIn,
      checkOut,
      notes,
      pickup,
      dropoff,
      status,
    } = body;

    const data: any = {};
    if (ownerName) data.ownerName = ownerName;
    if (ownerPhone) data.ownerPhone = ownerPhone;
    if (petName) data.petName = petName;
    if (typeof pickup === 'boolean') data.pickup = pickup;
    if (typeof dropoff === 'boolean') data.dropoff = dropoff;
    if (notes !== undefined) data.notes = notes || null;
    if (checkIn) data.checkIn = new Date(checkIn);
    if (checkOut) data.checkOut = new Date(checkOut);
    if (status) data.status = status;

    const updated = await prisma.hotelReservation.update({
      where: { id },
      data,
      include: { room: true },
    });

    // Update room availability based on status and dates
    if (status === 'cancelled') {
      await prisma.hotelRoom.update({ where: { id: updated.roomId }, data: { status: 'AVAILABLE' } });
    } else if (status === 'booked' || status === 'checked_in') {
      await prisma.hotelRoom.update({ where: { id: updated.roomId }, data: { status: 'OCCUPIED' } });
    }

    return NextResponse.json({ reservation: updated });
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

