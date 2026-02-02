import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, price, image, stock, categoryId } = await request.json();

    const updateData: any = {
      description,
      price: typeof price === 'number' ? price : parseFloat(price) || 0,
      image,
      stock: typeof stock === 'number' ? stock : parseInt(stock) || 0,
      categoryId,
    };

    // Only update slug if name changed
    if (name) {
      updateData.name = name;
      updateData.slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-+/g, '-');
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if product is referenced in any orders
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: params.id },
    });

    if (orderItemsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product. It is referenced in existing orders. Please remove it from orders first or mark it as unavailable instead.' },
        { status: 400 }
      );
    }

    // Delete related ProductViews first (they have cascade delete, but explicit for clarity)
    await prisma.productView.deleteMany({
      where: { productId: params.id },
    });

    // Delete the product
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
