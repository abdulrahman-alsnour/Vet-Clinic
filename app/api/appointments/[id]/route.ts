import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch a single appointment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            governorate: true,
            area: true,
            address: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update an appointment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { appointmentDate, appointmentTime, reason, notes, status, completionPrice, completionPaymentMethod } = body;

    // Build update data
    const updateData: any = {};

    if (appointmentDate !== undefined) {
      updateData.appointmentDate = new Date(appointmentDate);
    }
    if (appointmentTime !== undefined) {
      updateData.appointmentTime = appointmentTime;
    }
    if (reason !== undefined) {
      updateData.reason = reason;
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (completionPrice !== undefined) {
      updateData.completionPrice = completionPrice ? parseFloat(completionPrice) : null;
    }
    if (completionPaymentMethod !== undefined) {
      updateData.completionPaymentMethod = completionPaymentMethod || null;
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: updateData,
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
    });

    return NextResponse.json({ appointment: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.appointment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
