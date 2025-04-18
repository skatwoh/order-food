"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, CheckCircle2, XCircle } from "lucide-react"

type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled"

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  tableNumber: string
  items: OrderItem[]
  totalPrice: number
  status: OrderStatus
  createdAt: string
}

const statusIcons = {
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  preparing: <Clock className="h-5 w-5 text-blue-500" />,
  ready: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  completed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  cancelled: <XCircle className="h-5 w-5 text-red-500" />,
}

const statusLabels = {
  pending: "Đang chờ xử lý",
  preparing: "Đang chuẩn bị",
  ready: "Sẵn sàng phục vụ",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
}

export default function StatusPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      let orderIdToFetch = orderId

      // Nếu không có orderId trong URL, thử lấy từ localStorage
      if (!orderIdToFetch) {
        orderIdToFetch = localStorage.getItem("lastOrderId")

        // Nếu có orderId trong localStorage, cập nhật URL
        if (orderIdToFetch) {
          router.replace(`/status?orderId=${orderIdToFetch}`)
        } else {
          setLoading(false)
          return
        }
      }

      try {
        // Mock API call
        const response = await fetch(`https://6801bb5481c7e9fbcc433897.mockapi.io/Order/${orderIdToFetch}`)

        if (!response.ok) {
          throw new Error("Failed to fetch order")
        }

        const data = await response.json()
        console.log("Fetched order:", data) // Debug log
        setOrder(data)
      } catch (error) {
        console.error("Error fetching order:", error)
        setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()

    // Poll for updates every 30 seconds
    const intervalId = setInterval(fetchOrder, 30000)

    return () => clearInterval(intervalId)
  }, [orderId, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (error || !orderId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Trạng thái đơn hàng</h1>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Không tìm thấy đơn hàng</CardTitle>
            <CardDescription>{error || "Vui lòng kiểm tra lại mã đơn hàng của bạn."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/order">
              <Button className="w-full">Đặt món mới</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Trạng thái đơn hàng</h1>
      </div>

      {order ? (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Đơn hàng #{order.id}</CardTitle>
                  <CardDescription>Bàn số: {order.tableNumber}</CardDescription>
                </div>
                <div className="flex items-center bg-muted px-3 py-1 rounded-full">
                  {statusIcons[order.status]}
                  <span className="ml-2">{statusLabels[order.status]}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Các món đã đặt</h3>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <span>{item.name}</span>
                          <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                        <span>{(item.price * item.quantity).toLocaleString()}đ</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Tổng cộng:</span>
                    <span>{order.totalPrice.toLocaleString()}đ</span>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Thông tin đơn hàng</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Thời gian đặt:</div>
                    <div>{new Date(order.createdAt).toLocaleString("vi-VN")}</div>
                    <div>Trạng thái:</div>
                    <div className="flex items-center">
                      {statusIcons[order.status]}
                      <span className="ml-2">{statusLabels[order.status]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Link href="/order">
              <Button variant="outline">Đặt thêm món</Button>
            </Link>
          </div>
        </div>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Không tìm thấy đơn hàng</CardTitle>
            <CardDescription>Vui lòng kiểm tra lại mã đơn hàng của bạn.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/order">
              <Button className="w-full">Đặt món mới</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
