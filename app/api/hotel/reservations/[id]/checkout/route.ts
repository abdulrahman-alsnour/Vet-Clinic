import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { totalNights, roomRate, subtotal, pickupFee, dropoffFee, extraServices, total, paymentMethod } = body;

    if (!totalNights || !roomRate || !subtotal || !total || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required checkout fields' }, { status: 400 });
    }

    const reservation = await prisma.hotelReservation.findUnique({
      where: { id },
      include: { room: true },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    // Update reservation with checkout details
    await prisma.hotelReservation.update({
      where: { id },
      data: {
        totalNights,
        roomRate,
        subtotal,
        pickupFee: pickupFee || 0,
        dropoffFee: dropoffFee || 0,
        extraServices: extraServices && extraServices.length > 0 ? extraServices : null,
        total,
        paymentMethod,
        status: 'checked_out',
        checkedOutAt: new Date(),
      },
    });

    // Mark room as available again
    await prisma.hotelRoom.update({
      where: { id: reservation.roomId },
      data: { status: 'AVAILABLE' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing checkout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

