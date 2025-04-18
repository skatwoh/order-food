"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { BarChart3, Clock, DollarSign, Users } from "lucide-react"
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

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Mock API call
        const response = await fetch("https://6801bb5481c7e9fbcc433897.mockapi.io/Order")
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data = await response.json()
        setOrders(data)
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách đơn hàng",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()

    // Poll for updates every 30 seconds
    const intervalId = setInterval(fetchOrders, 30000)

    return () => clearInterval(intervalId)
  }, [toast])

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter((order) => order.status === status)
  }

  const getTotalRevenue = () => {
    return orders.filter((order) => order.status === "completed").reduce((total, order) => total + order.totalPrice, 0)
  }

  const getUniqueTableCount = () => {
    const tables = new Set(orders.map((order) => order.tableNumber))
    return tables.size
  }

  const getAverageOrderValue = () => {
    const completedOrders = orders.filter((order) => order.status === "completed")
    if (completedOrders.length === 0) return 0

    const total = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0)
    return Math.round(total / completedOrders.length)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title="Tổng quan" />

      <main className="flex-1 p-6">
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalRevenue().toLocaleString()}đ</div>
                <p className="text-xs text-muted-foreground">
                  Từ {orders.filter((order) => order.status === "completed").length} đơn hàng hoàn thành
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đơn hàng đang chờ</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getOrdersByStatus("pending").length}</div>
                <p className="text-xs text-muted-foreground">Cần được xử lý</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Số bàn đã phục vụ</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getUniqueTableCount()}</div>
                <p className="text-xs text-muted-foreground">Bàn đã đặt món</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Giá trị trung bình</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getAverageOrderValue().toLocaleString()}đ</div>
                <p className="text-xs text-muted-foreground">Trung bình mỗi đơn hàng</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pending">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="pending">Đang chờ ({getOrdersByStatus("pending").length})</TabsTrigger>
                <TabsTrigger value="preparing">Đang chuẩn bị ({getOrdersByStatus("preparing").length})</TabsTrigger>
                <TabsTrigger value="ready">Sẵn sàng ({getOrdersByStatus("ready").length})</TabsTrigger>
                <TabsTrigger value="completed">Hoàn thành ({getOrdersByStatus("completed").length})</TabsTrigger>
              </TabsList>

              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  Xem tất cả đơn hàng
                </Button>
              </Link>
            </div>

            <TabsContent value="pending" className="mt-4">
              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Đang tải đơn hàng...</p>
                </div>
              ) : getOrdersByStatus("pending").length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getOrdersByStatus("pending").map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">Không có đơn hàng nào đang chờ xử lý</div>
              )}
            </TabsContent>

            <TabsContent value="preparing" className="mt-4">
              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Đang tải đơn hàng...</p>
                </div>
              ) : getOrdersByStatus("preparing").length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getOrdersByStatus("preparing").map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">Không có đơn hàng nào đang được chuẩn bị</div>
              )}
            </TabsContent>

            <TabsContent value="ready" className="mt-4">
              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Đang tải đơn hàng...</p>
                </div>
              ) : getOrdersByStatus("ready").length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getOrdersByStatus("ready").map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">Không có đơn hàng nào sẵn sàng phục vụ</div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Đang tải đơn hàng...</p>
                </div>
              ) : getOrdersByStatus("completed").length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getOrdersByStatus("completed").map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">Không có đơn hàng nào đã hoàn thành</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {  
  return (
    <Link href={`/admin/orders/${order.id}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle className="text-lg">Bàn #{order.tableNumber}</CardTitle>
            <CardDescription>#{order.id}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString("vi-VN")}</div>

            <div className="space-y-1">
              {order.items.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="text-sm text-muted-foreground">+{order.items.length - 3} món khác</div>
              )}
            </div>

            <div className="pt-2 border-t flex justify-between font-medium">
              <span>Tổng cộng:</span>
              <span>{order.totalPrice.toLocaleString()}đ</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
