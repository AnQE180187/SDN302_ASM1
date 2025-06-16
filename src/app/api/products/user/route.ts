import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { getCurrentUser } from "@/utils/session";

// GET products by currently logged in user
export async function GET() {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching user products:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching user products" },
      { status: 500 }
    );
  }
}
