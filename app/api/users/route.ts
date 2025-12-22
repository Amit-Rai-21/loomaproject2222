import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";

/**
 * Normalizes date values from the database to ISO strings.
 * Prevents "toISOString is not a function" errors.
 */
const ensureISOString = (date: any): string => {
  if (!date) return new Date().toISOString(); // Fallback for null/undefined
  if (date instanceof Date) return date.toISOString(); // Handle BSON Date objects
  if (typeof date === 'string') return date; // Already a string
  try {
    return new Date(date).toISOString(); // Try to parse other formats
  } catch {
    return new Date().toISOString(); // Final safety fallback
  }
};

export async function GET() {
  try {
    const db = await getDatabase();
    if (!db) throw new Error("Database not available");

    // Fetch schools from the "schools" collection
    const schools = await db.collection("schools").find({}).toArray();

    // Transform documents to be JSON-safe
    const safeSchools = schools.map((doc) => ({
      ...doc,
      _id: doc._id.toString(), // Convert ObjectId to string
      // Use the utility to safely handle the lastSeen field
      lastSeen: ensureISOString(doc.lastSeen),
    }));

    return NextResponse.json(safeSchools);
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}