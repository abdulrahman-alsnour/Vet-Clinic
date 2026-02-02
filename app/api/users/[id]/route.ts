import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch a single user with full details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        pets: {
          take: 20, // Reduced from 50 to 20
          include: {
            vaccinations: {
              orderBy: { date: 'desc' },
              take: 5, // Reduced from 10 to 5
            },
            dewormings: {
              orderBy: { date: 'desc' },
              take: 5, // Reduced from 10 to 5
            },
            clinicVisits: {
              orderBy: { visitDate: 'desc' },
              take: 10, // Reduced from 20 to 10
            },
            weightHistory: {
              orderBy: { date: 'desc' },
              take: 10, // Reduced from 20 to 10
            },
          },
        },
        orders: {
          take: 20, // Reduced from 50 to 20
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    price: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        appointments: {
          take: 15, // Reduced from 30 to 15
          orderBy: {
            appointmentDate: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update a user's profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, phone, governorate, area, address } = body;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        phone,
        governorate,
        area,
        address,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a user and all related data
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete related records first due to Prisma's cascade delete limitations or explicit handling
    await prisma.appointment.deleteMany({
      where: { userId: params.id },
    });
    await prisma.order.deleteMany({
      where: { userId: params.id },
    });
    // Assuming pets have cascade delete for their sub-records (vaccinations, etc.)
    await prisma.pet.deleteMany({
      where: { userId: params.id },
    });

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

