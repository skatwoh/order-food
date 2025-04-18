import { NextResponse } from "next/server"

// Mock data for menu items
const menuItems = [
  {
    id: 1,
    name: "Gỏi cuốn tôm thịt",
    price: 65000,
    category: "appetizers",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Chả giò hải sản",
    price: 75000,
    category: "appetizers",
    image: "/placeholder.svg?height=100&width=100",
  },
  { id: 3, name: "Súp cua", price: 85000, category: "appetizers", image: "/placeholder.svg?height=100&width=100" },
  { id: 4, name: "Bò lúc lắc", price: 185000, category: "main-dishes", image: "/placeholder.svg?height=100&width=100" },
  {
    id: 5,
    name: "Cá hồi nướng",
    price: 220000,
    category: "main-dishes",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 6,
    name: "Gà nướng sả",
    price: 165000,
    category: "main-dishes",
    image: "/placeholder.svg?height=100&width=100",
  },
  { id: 7, name: "Chè khúc bạch", price: 45000, category: "desserts", image: "/placeholder.svg?height=100&width=100" },
  { id: 8, name: "Bánh flan", price: 35000, category: "desserts", image: "/placeholder.svg?height=100&width=100" },
  { id: 9, name: "Nước ép cam", price: 45000, category: "drinks", image: "/placeholder.svg?height=100&width=100" },
  { id: 10, name: "Sinh tố bơ", price: 55000, category: "drinks", image: "/placeholder.svg?height=100&width=100" },
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(menuItems)
}

export async function POST(request: Request) {
  const data = await request.json()

  // Validate required fields
  if (!data.name || !data.price || !data.category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Create new menu item
  const newItem = {
    id: menuItems.length > 0 ? Math.max(...menuItems.map((item) => item.id)) + 1 : 1,
    name: data.name,
    price: data.price,
    category: data.category,
    image: data.image || "/placeholder.svg?height=100&width=100",
  }

  // Add to menu items
  menuItems.push(newItem)

  return NextResponse.json(newItem)
}
