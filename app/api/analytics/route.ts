import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week';

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get page views
    const pageViews = await prisma.pageView.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get unique visitors by counting distinct sessionIds
    const uniqueSessions = await prisma.pageView.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        sessionId: true,
      },
      distinct: ['sessionId'],
    });

    const uniqueVisitors = uniqueSessions.length;

    // Get product views
    const productViews = await prisma.productView.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get top products by views
    const topProducts = await prisma.productView.groupBy({
      by: ['productId'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    // Get product details for top products
    const topProductsDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { category: true },
        });
        return {
          ...product,
          views: item._count.id,
        };
      })
    );

    // Get orders stats
    const totalOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    const pendingOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'pending',
      },
    });

    const completedOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'completed',
      },
    });

    const cancelledOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'cancelled',
      },
    });

    // Get revenue (only completed orders)
    const revenueData = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'completed',
      },
      _sum: {
        total: true,
      },
    });

    const revenue = revenueData._sum.total || 0;

    // Get appointments stats
    const totalAppointments = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    const upcomingAppointments = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'upcoming',
      },
    });

    const completedAppointments = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'completed',
      },
    });

    const cancelledAppointments = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'cancelled',
      },
    });

    // Get appointment revenue (completed appointments with prices)
    const appointmentRevenueData = await prisma.appointment.aggregate({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'completed',
        completionPrice: {
          not: null,
        },
      },
      _sum: {
        completionPrice: true,
      },
    });

    const appointmentRevenue = appointmentRevenueData._sum.completionPrice || 0;

    // Get hotel reservations stats
    const totalHotelReservations = await prisma.hotelReservation.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    const checkedOutReservations = await prisma.hotelReservation.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'checked_out',
      },
    });

    const bookedReservations = await prisma.hotelReservation.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'booked',
      },
    });

    const checkedInReservations = await prisma.hotelReservation.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'checked_in',
      },
    });

    const cancelledHotelReservations = await prisma.hotelReservation.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'cancelled',
      },
    });

    // Get hotel revenue (checked out reservations with total amounts)
    const hotelRevenueData = await prisma.hotelReservation.aggregate({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: 'checked_out',
        total: {
          not: null,
        },
      },
      _sum: {
        total: true,
      },
    });

    const hotelRevenue = hotelRevenueData._sum.total || 0;
    const totalRevenue = revenue + appointmentRevenue + hotelRevenue;

    return NextResponse.json({
      pageViews,
      uniqueVisitors,
      productViews,
      orders: totalOrders,
      revenue,
      appointmentRevenue,
      hotelRevenue,
      totalRevenue,
      topProducts: topProductsDetails,
      ordersStats: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
      },
      appointments: {
        total: totalAppointments,
        upcoming: upcomingAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
      },
      hotelReservations: {
        total: totalHotelReservations,
        booked: bookedReservations,
        checkedIn: checkedInReservations,
        checkedOut: checkedOutReservations,
        cancelled: cancelledHotelReservations,
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
