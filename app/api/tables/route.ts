import { NextResponse } from "next/server"

// Mock data for tables
const tables = [
  { id: "T1", number: "1", capacity: 2, status: "available" },
  { id: "T2", number: "2", capacity: 4, status: "occupied" },
  { id: "T3", number: "3", capacity: 4, status: "available" },
  { id: "T4", number: "4", capacity: 6, status: "reserved" },
  { id: "T5", number: "5", capacity: 2, status: "occupied" },
  { id: "T6", number: "6", capacity: 8, status: "available" },
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(tables)
}

export async function POST(request: Request) {
  const data = await request.json()

  // Validate required fields
  if (!data.number || !data.capacity) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Create new table
  const newTable = {
    id: `T${tables.length + 1}`,
    number: data.number,
    capacity: data.capacity,
    status: data.status || "available",
  }

  // Add to tables
  tables.push(newTable)

  return NextResponse.json(newTable)
}
