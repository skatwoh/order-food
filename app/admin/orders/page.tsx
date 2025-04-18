"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Clock, Search, XCircle } from "lucide-react"
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
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  preparing: <Clock className="h-4 w-4 text-blue-500" />,
  ready: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  cancelled: <XCircle className="h-4 w-4 text-red-500" />,
}

const statusLabels = {
  pending: "Đang chờ xử lý",
  preparing: "Đang chuẩn bị",
  ready: "Sẵn sàng phục vụ",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
}

export default function AdminOrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

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
  }, [toast])

  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false
    }

    // Filter by search query (table number or order ID)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return order.tableNumber.toLowerCase().includes(query) || order.id.toLowerCase().includes(query)
    }

    return true
  })

  // Sort orders by creation date (newest first)
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title="Quản lý đơn hàng" />

      <main className="flex-1 p-6">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo số bàn hoặc mã đơn hàng..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Đang chờ xử lý</SelectItem>
                <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
                <SelectItem value="ready">Sẵn sàng phục vụ</SelectItem>
                <SelectItem value="completed">Đã hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Đang tải đơn hàng...</p>
            </div>
          ) : sortedOrders.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn hàng</TableHead>
                    <TableHead>Bàn</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>Bàn {order.tableNumber}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleString("vi-VN")}</TableCell>
                      <TableCell>{order.totalPrice.toLocaleString()}đ</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {statusIcons[order.status]}
                          <span className="ml-2">{statusLabels[order.status]}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            Chi tiết
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">Không tìm thấy đơn hàng nào</div>
          )}
        </Card>
      </main>
    </div>
  )
}
