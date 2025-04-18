import { NextResponse } from "next/server"

// This is a reference to the mock data in the main tables route
// In a real app, you would use a database
import { tables } from "../shared"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const id = params.id
  const table = tables.find((table) => table.id === id)

  if (!table) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 })
  }

  return NextResponse.json(table)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const data = await request.json()

  const tableIndex = tables.findIndex((table) => table.id === id)

  if (tableIndex === -1) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 })
  }

  // Update table
  const updatedTable = {
    ...tables[tableIndex],
    ...data,
    id, // Ensure ID doesn't change
  }

  tables[tableIndex] = updatedTable

  return NextResponse.json(updatedTable)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  const tableIndex = tables.findIndex((table) => table.id === id)

  if (tableIndex === -1) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 })
  }

  // Remove table
  const deletedTable = tables[tableIndex]
  tables.splice(tableIndex, 1)

  return NextResponse.json(deletedTable)
}
