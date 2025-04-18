import { NextResponse } from "next/server"

// Mock data for orders
const orders = [
  {
    id: "ORD001",
    tableNumber: "5",
    items: [
      { id: 1, name: "Gỏi cuốn tôm thịt", price: 65000, quantity: 2 },
      { id: 4, name: "Bò lúc lắc", price: 185000, quantity: 1 },
    ],
    totalPrice: 315000,
    status: "completed",
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: "ORD002",
    tableNumber: "8",
    items: [
      { id: 6, name: "Gà nướng sả", price: 165000, quantity: 1 },
      { id: 9, name: "Nước ép cam", price: 45000, quantity: 2 },
    ],
    totalPrice: 255000,
    status: "preparing",
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
  },
  {
    id: "ORD003",
    tableNumber: "3",
    items: [
      { id: 2, name: "Chả giò hải sản", price: 75000, quantity: 1 },
      { id: 5, name: "Cá hồi nướng", price: 220000, quantity: 1 },
      { id: 10, name: "Sinh tố bơ", price: 55000, quantity: 1 },
    ],
    totalPrice: 350000,
    status: "pending",
    createdAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
  },
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  const data = await request.json()

  // Validate required fields
  if (!data.tableNumber || !data.items || data.items.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Create new order
  const newOrder = {
    id: `ORD${String(orders.length + 1).padStart(3, "0")}`,
    tableNumber: data.tableNumber,
    items: data.items,
    totalPrice: data.totalPrice || data.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
    status: data.status || "pending",
    createdAt: new Date().toISOString(),
  }

  // Add to orders
  orders.unshift(newOrder)

  // Make sure to export the updated orders array
  return NextResponse.json(newOrder)
}

// Export orders for use in other route handlers
export { orders }
