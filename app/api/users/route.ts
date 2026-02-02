import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all users
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'user', // Only fetch regular users, not admins
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        governorate: true,
        area: true,
        address: true,
        createdAt: true,
        _count: {
          select: {
            pets: true,
            orders: true,
            appointments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Return users with actual counts instead of dummy arrays
    const usersWithCounts = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      governorate: user.governorate,
      area: user.area,
      address: user.address,
      createdAt: user.createdAt,
      petsCount: user._count.pets,
      ordersCount: user._count.orders,
      appointmentsCount: user._count.appointments,
    }));

    return NextResponse.json({ users: usersWithCounts });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

