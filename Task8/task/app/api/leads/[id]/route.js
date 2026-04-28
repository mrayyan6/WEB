import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/lib/models/Lead";
import { getSession } from "@/lib/auth";

export async function PUT(request, { params }) {
  const session = await getSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();
  const body = await request.json();
  const lead = await Lead.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(lead);
}

export async function DELETE(request, { params }) {
  const session = await getSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();
  await Lead.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
