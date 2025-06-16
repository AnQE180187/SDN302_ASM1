import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { getCurrentUser } from "@/utils/session";

// GET current user's full profile data
export async function GET() {
  try {
    // Check authentication
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch full user details from database
    const user = await prisma.user.findUnique({
      where: {
        id: sessionUser.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get total value of all user products
    const productsStats = await prisma.product.aggregate({
      where: {
        userId: sessionUser.id,
      },
      _sum: {
        price: true,
      },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        productsStats: {
          totalCount: productsStats._count,
          totalValue: productsStats._sum.price || 0,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching user profile" },
      { status: 500 }
    );
  }
}
