import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { getCurrentUser } from "@/utils/session";

// Get single product
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params.id;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
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

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching product" },
      { status: 500 }
    );
  }
}

// Update product
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params.id;

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

    // Check if the product belongs to the user
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to update this product" },
        { status: 403 }
      );
    }
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        image: body.image || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, error: "Error updating product" },
      { status: 500 }
    );
  }
}

// Delete product
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params.id;

  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if the product belongs to the user
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this product" },
        { status: 403 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: "Error deleting product" },
      { status: 500 }
    );
  }
}
