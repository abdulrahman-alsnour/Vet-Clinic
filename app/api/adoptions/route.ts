import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all active adoptions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';

    const adoptions = await prisma.petAdoption.findMany({
      where: {
        status: status,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to 50 most recent
    });

    return NextResponse.json({ adoptions });
  } catch (error: any) {
    console.error('Error fetching adoptions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch adoptions' },
      { status: 500 }
    );
  }
}

// POST - Create a new adoption post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petName, description, phoneNumber, area, images } = body;

    // Validation
    if (!petName || !description || !phoneNumber || !area) {
      return NextResponse.json(
        { error: 'Missing required fields: petName, description, phoneNumber, area' },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    // Store images as JSON string
    const imagesJson = JSON.stringify(images);

    const adoption = await prisma.petAdoption.create({
      data: {
        petName: petName.trim(),
        description: description.trim(),
        phoneNumber: phoneNumber.trim(),
        area: area.trim(),
        images: imagesJson,
        status: 'active',
      },
    });

    return NextResponse.json({ adoption }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating adoption post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create adoption post' },
      { status: 500 }
    );
  }
}

