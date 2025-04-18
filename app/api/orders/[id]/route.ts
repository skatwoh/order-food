import { NextResponse } from "next/server"

// Import orders từ shared để đảm bảo sử dụng cùng một tham chiếu
import { orders } from "../shared"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const id = params.id
  console.log("Looking for order:", id) // Debug log
  console.log("Available orders:", orders) // Debug log

  const order = orders.find((order) => order.id === id)

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json(order)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const data = await request.json()

  const orderIndex = orders.findIndex((order) => order.id === id)

  if (orderIndex === -1) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  // Update order
  const updatedOrder = {
    ...orders[orderIndex],
    ...data,
  }

  orders[orderIndex] = updatedOrder

  return NextResponse.json(updatedOrder)
}
