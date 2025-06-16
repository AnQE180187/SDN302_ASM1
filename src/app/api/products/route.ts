import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { getCurrentUser } from "@/utils/session";

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
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
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching products" },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(request: Request) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.description || !body.price) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        image: body.image || null,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: "Error creating product" },
      { status: 500 }
    );
  }
}
