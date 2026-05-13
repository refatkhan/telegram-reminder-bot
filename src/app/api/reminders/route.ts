import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db("studyReminder");

    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      message: "MongoDB Connected Successfully",
      collections,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error,
      },
      { status: 500 }
    );
  }
}