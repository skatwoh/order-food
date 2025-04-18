"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle2, Clock, Printer, XCircle } from "lucide-react"
import AdminHeader from "@/components/admin-header"

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

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("")

  const orderId = params.id as string

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Mock API call
        const response = await fetch(`https://6801bb5481c7e9fbcc433897.mockapi.io/Order/${orderId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch order")
        }

        const data = await response.json()
        setOrder(data)
        setSelectedStatus(data.status)
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin đơn hàng",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, toast])

  const handleUpdateStatus = async () => {
    if (!order || !selectedStatus || selectedStatus === order.status) return

    setUpdating(true)

    try {
      // Mock API call
      const response = await fetch(`https://6801bb5481c7e9fbcc433897.mockapi.io/Order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: selectedStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order")
      }

      const updatedOrder = await response.json()
      setOrder(updatedOrder)

      toast({
        title: "Cập nhật thành công",
        description: `Đơn hàng đã được cập nhật thành ${statusLabels[selectedStatus]}`,
      })
    } catch (error) {
      toast({
        title: "Cập nhật thất bại",
        description: "Không thể cập nhật trạng thái đơn hàng",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <AdminHeader title="Chi tiết đơn hàng" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Đang tải thông tin đơn hàng...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col">
        <AdminHeader title="Chi tiết đơn hàng" />
        <main className="flex-1 p-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Không tìm thấy đơn hàng</CardTitle>
              <CardDescription>Đơn hàng không tồn tại hoặc đã bị xóa.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/admin/orders")} className="w-full">
                Quay lại danh sách đơn hàng
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title="Chi tiết đơn hàng" />

      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin/orders")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold ml-2">Đơn hàng #{order.id}</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Chi tiết đơn hàng</CardTitle>
                <CardDescription>
                  Bàn {order.tableNumber} - {new Date(order.createdAt).toLocaleString("vi-VN")}
                </CardDescription>
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

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Tổng cộng:</span>
                    <span>{order.totalPrice.toLocaleString()}đ</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  In đơn hàng
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trạng thái đơn hàng</CardTitle>
                <CardDescription>Cập nhật trạng thái đơn hàng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-muted p-2 rounded-full">{statusIcons[order.status]}</div>
                  <div>
                    <div className="font-medium">Trạng thái hiện tại</div>
                    <div className="text-sm text-muted-foreground">{statusLabels[order.status]}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cập nhật trạng thái</label>
                  <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as OrderStatus)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Đang chờ xử lý</SelectItem>
                      <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
                      <SelectItem value="ready">Sẵn sàng phục vụ</SelectItem>
                      <SelectItem value="completed">Đã hoàn thành</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-rose-500 hover:bg-rose-600"
                  disabled={updating || selectedStatus === order.status || !selectedStatus}
                  onClick={handleUpdateStatus}
                >
                  {updating ? (
                    <>
                      <span className="mr-2">Đang cập nhật</span>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    "Cập nhật trạng thái"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
