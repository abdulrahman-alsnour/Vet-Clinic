import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST - Create a new user (owner) by admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, governorate, area, address, password } = body;

    // Validate required fields - only name and phone are required
    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    // Generate unique email if not provided for admin-only purposes (no login required)
    let finalEmail = email;
    if (!email) {
      // Generate a unique email based on phone and timestamp for admin-only owner
      finalEmail = `owner-${phone.replace(/\D/g, '')}-${Date.now()}@vetclinic.local`;
    }

    // Check if email already exists and generate a unique one if it does
    let existingUser = await prisma.user.findUnique({
      where: { email: finalEmail.toLowerCase() },
    });

    if (existingUser) {
      // If email exists, generate a new unique one
      finalEmail = `owner-${phone.replace(/\D/g, '')}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@vetclinic.local`;
    }

    // Hash password only if provided, otherwise use a dummy hash
    const hashedPassword = password 
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash('no-login-' + Date.now(), 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: finalEmail.toLowerCase(),
        password: hashedPassword,
        name,
        phone,
        governorate,
        area,
        address,
        role: 'user',
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        governorate: true,
        area: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

