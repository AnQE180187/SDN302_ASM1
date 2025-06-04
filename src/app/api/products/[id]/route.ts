import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

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
    });

    if (!product) {
      return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
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
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.description || !body.price) {
      return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        image: body.image || null
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product
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
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
        { success: false, error: "Error deleting product" },
        { status: 500 }
    );
  }
}