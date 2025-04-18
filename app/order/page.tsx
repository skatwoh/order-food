"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MinusCircle, PlusCircle, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Mock data
const MENU_CATEGORIES = [
  { id: "appetizers", name: "Khai vị" },
  { id: "main-dishes", name: "Món chính" },
  { id: "desserts", name: "Tráng miệng" },
  { id: "drinks", name: "Đồ uống" },
]

export default function OrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [tableNumber, setTableNumber] = useState("")
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([])
  const [activeTab, setActiveTab] = useState("appetizers");
  const [menuItems, setMenuItems] = useState<{ id: number; name: string; price: number; image?: string; category: string }[]>([])

  const addToCart = (item: { id: number; name: string; price: number }) => {
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        return [...prev, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (itemId: number) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === itemId)
      if (existingItem && existingItem.quantity > 1) {
        return prev.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item))
      } else {
        return prev.filter((item) => item.id !== itemId)
      }
    })
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Mock API call
        const response = await fetch("https://6801bb5481c7e9fbcc433897.mockapi.io/menu")
        if (!response.ok) {
          throw new Error("Failed to fetch menu items")
        }

        const data = await response.json()
        setMenuItems(data)
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách món ăn",
          variant: "destructive",
        })
      }
    }

    fetchMenuItems()
  }, [toast])

  // Sửa hàm handleSubmitOrder để đảm bảo chuyển hướng đúng và xử lý lỗi tốt hơn
  const handleSubmitOrder = async () => {
    if (!tableNumber) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số bàn",
        variant: "destructive",
      })
      return
    }

    if (cart.length === 0) {
      toast({
        title: "Lỗi",
        description: "Giỏ hàng của bạn đang trống",
        variant: "destructive",
      })
      return
    }

    try {
      // Mock API call
      const response = await fetch("https://6801bb5481c7e9fbcc433897.mockapi.io/Order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableNumber,
          items: cart,
          totalPrice: getTotalPrice(),
          status: "pending",
          createdAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Đặt hàng thành công",
          description: `Mã đơn hàng của bạn là: ${data.orderId || data.id}`,
        })

        // Lưu orderId vào localStorage để dễ dàng truy cập sau này
        localStorage.setItem("lastOrderId", data.orderId || data.id)

        // Chuyển hướng đến trang trạng thái với orderId
        router.push(`/status?orderId=${data.orderId || data.id}`)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to place order")
      }
    } catch (error) {
      console.error("Order error:", error)
      toast({
        title: "Đặt hàng thất bại",
        description: "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }
      

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Đặt món ăn</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Label htmlFor="tableNumber">Số bàn</Label>
            <Input
              id="tableNumber"
              placeholder="Nhập số bàn của bạn"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="max-w-xs"
            />
          </div>

          <Tabs defaultValue="appetizers" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 flex flex-wrap">
              {MENU_CATEGORIES.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {MENU_CATEGORIES.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.filter((item) => item.category === category.id).map((item) => (
                    <Card key={item.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2 flex justify-between">
                        <div className="flex items-center">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <span className="font-medium">{item.price.toLocaleString()}đ</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => addToCart(item)} className="h-8 w-8">
                          <PlusCircle className="h-5 w-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Giỏ hàng
                {cart.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">Giỏ hàng của bạn đang trống</div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.price.toLocaleString()}đ x {item.quantity}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="h-8 w-8">
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => addToCart(item)} className="h-8 w-8">
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-medium">
                      <span>Tổng cộng:</span>
                      <span>{getTotalPrice().toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-rose-500 hover:bg-rose-600"
                disabled={cart.length === 0 || !tableNumber}
                onClick={handleSubmitOrder}
              >
                Đặt món
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
