import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      deliveryMethod,
      paymentMethod,
      orderItems,
      total,
      status,
      notes,
    } = body;

    // Create the order
    const orderStatus = status || 'pending';
    const order = await prisma.order.create({
      data: {
        userId: userId || null, // Associate order with user if logged in
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        deliveryMethod,
        paymentMethod: paymentMethod || 'cash',
        total,
        status: orderStatus,
        notes: notes || null,
        orderItems: {
          create: orderItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Decrease stock immediately when order is placed
    // Stock will be restored if order is cancelled
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50'); // Default to 50 orders per page
    const skip = (page - 1) * limit;

    // Build the where clause for filtering
    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }

    // Filter by userId if provided (for user's own orders)
    if (userId) {
      where.userId = userId;
    }

    // Add date filtering
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        take: limit,
        skip,
        orderBy: [
          { createdAt: 'desc' }, // Sort by newest first
          { status: 'asc' }, // Then sort by status
        ],
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ 
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
