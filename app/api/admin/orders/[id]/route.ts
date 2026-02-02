import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, notes } = await request.json();

    // First, get the current order to check its status
    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update the order status
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        notes,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // If status is being changed to 'cancelled', restore stock
    if (status === 'cancelled' && currentOrder.status !== 'cancelled') {
      for (const item of currentOrder.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    // If order was 'cancelled' and is being changed to something else (except cancelled), decrease stock again
    if (currentOrder.status === 'cancelled' && status !== 'cancelled') {
      for (const item of currentOrder.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
