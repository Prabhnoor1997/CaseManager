import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Client from "@/models/Client";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const type = searchParams.get("type") || "";

    await connectDB();

    // Build filter object
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get contacts with pagination
    const contacts = await Client.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Client.countDocuments(filter);

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Error fetching contacts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contactData = await req.json();

    await connectDB();

    // Check if email already exists
    const existingContact = await Client.findOne({ email: contactData.email });
    if (existingContact) {
      return NextResponse.json(
        { error: "A contact with this email already exists" },
        { status: 400 }
      );
    }

    // Create the new contact
    const contact = await Client.create(contactData);

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      const validationErrors = Object.values((error as any).errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: "Validation error", details: validationErrors },
        { status: 400 }
      );
    }

    // Handle duplicate key error
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === 11000
    ) {
      return NextResponse.json(
        { error: "A contact with this email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error creating contact" },
      { status: 500 }
    );
  }
}
