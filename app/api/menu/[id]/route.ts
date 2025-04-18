import { NextResponse } from "next/server"

// This is a reference to the mock data in the main menu route
// In a real app, you would use a database
import { menuItems } from "../shared"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const id = Number.parseInt(params.id)
  const item = menuItems.find((item) => item.id === id)

  if (!item) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
  }

  return NextResponse.json(item)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const data = await request.json()

  const itemIndex = menuItems.findIndex((item) => item.id === id)

  if (itemIndex === -1) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
  }

  // Update menu item
  const updatedItem = {
    ...menuItems[itemIndex],
    ...data,
    id, // Ensure ID doesn't change
  }

  menuItems[itemIndex] = updatedItem

  return NextResponse.json(updatedItem)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  const itemIndex = menuItems.findIndex((item) => item.id === id)

  if (itemIndex === -1) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
  }

  // Remove menu item
  const deletedItem = menuItems[itemIndex]
  menuItems.splice(itemIndex, 1)

  return NextResponse.json(deletedItem)
}
