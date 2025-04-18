"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Edit, Plus, Trash } from "lucide-react"
import AdminHeader from "@/components/admin-header"

interface Table {
  id: string
  number: string
  capacity: number
  status: "available" | "occupied" | "reserved"
}

export default function AdminTablesPage() {
  const { toast } = useToast()
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Table>>({
    number: "",
    capacity: 4,
    status: "available",
  })
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)

  useEffect(() => {
    const fetchTables = async () => {
      try {
        // Mock API call
        const response = await fetch("/api/tables")
        if (!response.ok) {
          throw new Error("Failed to fetch tables")
        }

        const data = await response.json()
        setTables(data)
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách bàn",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTables()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as "available" | "occupied" | "reserved",
    }))
  }

  const handleAddTable = async () => {
    if (!formData.number || !formData.capacity) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bàn",
        variant: "destructive",
      })
      return
    }

    try {
      // Mock API call
      const response = await fetch("/api/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to add table")
      }

      const newTable = await response.json()
      setTables((prev) => [...prev, newTable])

      toast({
        title: "Thêm bàn thành công",
        description: `Đã thêm bàn số ${newTable.number}`,
      })

      setIsAddDialogOpen(false)
      setFormData({
        number: "",
        capacity: 4,
        status: "available",
      })
    } catch (error) {
      toast({
        title: "Thêm bàn thất bại",
        description: "Không thể thêm bàn mới",
        variant: "destructive",
      })
    }
  }

  const handleEditTable = async () => {
    if (!selectedTable) return

    if (!formData.number || !formData.capacity) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bàn",
        variant: "destructive",
      })
      return
    }

    try {
      // Mock API call
      const response = await fetch(`/api/tables/${selectedTable.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update table")
      }

      const updatedTable = await response.json()
      setTables((prev) => prev.map((table) => (table.id === updatedTable.id ? updatedTable : table)))

      toast({
        title: "Cập nhật thành công",
        description: `Đã cập nhật bàn số ${updatedTable.number}`,
      })

      setIsEditDialogOpen(false)
      setSelectedTable(null)
    } catch (error) {
      toast({
        title: "Cập nhật thất bại",
        description: "Không thể cập nhật thông tin bàn",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTable = async () => {
    if (!selectedTable) return

    try {
      // Mock API call
      const response = await fetch(`/api/tables/${selectedTable.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete table")
      }

      setTables((prev) => prev.filter((table) => table.id !== selectedTable.id))

      toast({
        title: "Xóa bàn thành công",
        description: `Đã xóa bàn số ${selectedTable.number}`,
      })

      setIsDeleteDialogOpen(false)
      setSelectedTable(null)
    } catch (error) {
      toast({
        title: "Xóa bàn thất bại",
        description: "Không thể xóa bàn",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (table: Table) => {
    setSelectedTable(table)
    setFormData({
      number: table.number,
      capacity: table.capacity,
      status: table.status,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (table: Table) => {
    setSelectedTable(table)
    setIsDeleteDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-red-100 text-red-800"
      case "reserved":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Trống"
      case "occupied":
        return "Đang sử dụng"
      case "reserved":
        return "Đã đặt trước"
      default:
        return status
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title="Quản lý bàn" />

      <main className="flex-1 p-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Danh sách bàn</h2>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-rose-500 hover:bg-rose-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm bàn mới
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm bàn mới</DialogTitle>
                  <DialogDescription>Thêm bàn mới vào nhà hàng</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="number">Số bàn</Label>
                    <Input
                      id="number"
                      name="number"
                      placeholder="Nhập số bàn"
                      value={formData.number}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="capacity">Sức chứa</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      placeholder="Nhập sức chứa"
                      value={formData.capacity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select value={formData.status} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Trống</SelectItem>
                        <SelectItem value="occupied">Đang sử dụng</SelectItem>
                        <SelectItem value="reserved">Đã đặt trước</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button className="bg-rose-500 hover:bg-rose-600" onClick={handleAddTable}>
                    Thêm bàn
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Đang tải danh sách bàn...</p>
            </div>
          ) : tables.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map((table) => (
                <Card key={table.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold">Bàn {table.number}</h3>
                          <p className="text-muted-foreground">Sức chứa: {table.capacity} người</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
                          {getStatusLabel(table.status)}
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted p-4 flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(table)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                        onClick={() => openDeleteDialog(table)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Xóa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">Chưa có bàn nào được thêm vào hệ thống</div>
          )}
        </Card>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bàn</DialogTitle>
            <DialogDescription>Cập nhật thông tin bàn</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-number">Số bàn</Label>
              <Input
                id="edit-number"
                name="number"
                placeholder="Nhập số bàn"
                value={formData.number}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-capacity">Sức chứa</Label>
              <Input
                id="edit-capacity"
                name="capacity"
                type="number"
                placeholder="Nhập sức chứa"
                value={formData.capacity}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Trống</SelectItem>
                  <SelectItem value="occupied">Đang sử dụng</SelectItem>
                  <SelectItem value="reserved">Đã đặt trước</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-rose-500 hover:bg-rose-600" onClick={handleEditTable}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa bàn này?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedTable && (
              <div>
                <p className="font-medium">Bàn {selectedTable.number}</p>
                <p className="text-sm text-muted-foreground">Sức chứa: {selectedTable.capacity} người</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteTable}>
              Xóa bàn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
