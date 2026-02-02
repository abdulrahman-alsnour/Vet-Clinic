import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rooms = await prisma.hotelRoom.findMany({
      orderBy: [{ type: 'asc' }, { roomNumber: 'asc' }],
    });

    const counts = {
      DOG: rooms.filter(r => r.type === 'DOG').length,
      CAT: rooms.filter(r => r.type === 'CAT').length,
      BIRD: rooms.filter(r => r.type === 'BIRD').length,
      available: rooms.filter(r => r.status === 'AVAILABLE').length,
      occupied: rooms.filter(r => r.status === 'OCCUPIED').length,
    };

    return NextResponse.json({ rooms, counts });
  } catch (error) {
    console.error('Error fetching hotel rooms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { init } = body || {};

    if (init) {
      // Seed default rooms if none exist
      const existing = await prisma.hotelRoom.count();
      if (existing === 0) {
        const createBatch: { roomNumber: number; type: 'DOG' | 'CAT' | 'BIRD' }[] = [];
        for (let i = 1; i <= 5; i++) createBatch.push({ roomNumber: i, type: 'DOG' });
        for (let i = 1; i <= 10; i++) createBatch.push({ roomNumber: i, type: 'CAT' });
        for (let i = 1; i <= 5; i++) createBatch.push({ roomNumber: i, type: 'BIRD' });

        await prisma.hotelRoom.createMany({
          data: createBatch.map(r => ({ roomNumber: r.roomNumber, type: r.type })),
          skipDuplicates: true,
        });
      }

      return NextResponse.json({ ok: true });
    }

    // Allow creating a single room manually
    const { roomNumber, type } = body || {};
    if (!roomNumber || !type) {
      return NextResponse.json({ error: 'roomNumber and type are required' }, { status: 400 });
    }
    const room = await prisma.hotelRoom.create({ data: { roomNumber: Number(roomNumber), type } });
    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    console.error('Error creating hotel room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

