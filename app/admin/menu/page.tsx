"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Edit, Plus, Trash } from "lucide-react"
import AdminHeader from "@/components/admin-header"

interface MenuItem {
  id: number
  name: string
  price: number
  category: string
  image: string
}

// Mock data
const MENU_CATEGORIES = [
  { id: "appetizers", name: "Khai vị" },
  { id: "main-dishes", name: "Món chính" },
  { id: "desserts", name: "Tráng miệng" },
  { id: "drinks", name: "Đồ uống" },
]

export default function AdminMenuPage() {
  const { toast } = useToast()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    price: 0,
    category: "",
    image: "/placeholder.svg?height=100&width=100",
  })
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

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
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleAddItem = async () => {
    if (!formData.name || !formData.category || formData.price <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin món ăn",
        variant: "destructive",
      })
      return
    }

    try {
      // Mock API call
      const response = await fetch("https://6801bb5481c7e9fbcc433897.mockapi.io/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to add menu item")
      }

      const newItem = await response.json()
      setMenuItems((prev) => [...prev, newItem])

      toast({
        title: "Thêm món thành công",
        description: `Đã thêm ${newItem.name} vào thực đơn`,
      })

      setIsAddDialogOpen(false)
      setFormData({
        name: "",
        price: 0,
        category: "",
        image: "/placeholder.svg?height=100&width=100",
      })
    } catch (error) {
      toast({
        title: "Thêm món thất bại",
        description: "Không thể thêm món ăn mới",
        variant: "destructive",
      })
    }
  }

  const handleEditItem = async () => {
    if (!selectedItem) return

    if (!formData.name || !formData.category || formData.price <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin món ăn",
        variant: "destructive",
      })
      return
    }

    try {
      // Mock API call
      const response = await fetch(`https://6801bb5481c7e9fbcc433897.mockapi.io/menu/${selectedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update menu item")
      }

      const updatedItem = await response.json()
      setMenuItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))

      toast({
        title: "Cập nhật thành công",
        description: `Đã cập nhật ${updatedItem.name}`,
      })

      setIsEditDialogOpen(false)
      setSelectedItem(null)
    } catch (error) {
      toast({
        title: "Cập nhật thất bại",
        description: "Không thể cập nhật món ăn",
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async () => {
    if (!selectedItem) return

    try {
      // Mock API call
      const response = await fetch(`https://6801bb5481c7e9fbcc433897.mockapi.io/menu/${selectedItem.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete menu item")
      }

      setMenuItems((prev) => prev.filter((item) => item.id !== selectedItem.id))

      toast({
        title: "Xóa món thành công",
        description: `Đã xóa ${selectedItem.name} khỏi thực đơn`,
      })

      setIsDeleteDialogOpen(false)
      setSelectedItem(null)
    } catch (error) {
      toast({
        title: "Xóa món thất bại",
        description: "Không thể xóa món ăn",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (item: MenuItem) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (item: MenuItem) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }

  const filteredItems = menuItems.filter((item) => {
    if (activeTab === "all") return true
    return item.category === activeTab
  })

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader title="Quản lý thực đơn" />

      <main className="flex-1 p-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                {MENU_CATEGORIES.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-rose-500 hover:bg-rose-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm món mới
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm món mới</DialogTitle>
                  <DialogDescription>Thêm món ăn mới vào thực đơn của nhà hàng</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Tên món</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Nhập tên món ăn"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Giá (VNĐ)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="Nhập giá món ăn"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {MENU_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button className="bg-rose-500 hover:bg-rose-600" onClick={handleAddItem}>
                    Thêm món
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Đang tải thực đơn...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hình ảnh</TableHead>
                    <TableHead>Tên món</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        {MENU_CATEGORIES.find((cat) => cat.id === item.category)?.name || item.category}
                      </TableCell>
                      <TableCell>{item.price.toLocaleString()}đ</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => openEditDialog(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500"
                            onClick={() => openDeleteDialog(item)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">Không tìm thấy món ăn nào</div>
          )}
        </Card>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa món ăn</DialogTitle>
            <DialogDescription>Cập nhật thông tin món ăn</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Tên món</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="Nhập tên món ăn"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Giá (VNĐ)</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                placeholder="Nhập giá món ăn"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Danh mục</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {MENU_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-rose-500 hover:bg-rose-600" onClick={handleEditItem}>
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
            <DialogDescription>Bạn có chắc chắn muốn xóa món ăn này khỏi thực đơn?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedItem && (
              <div className="flex items-center space-x-4">
                <img
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <p className="font-medium">{selectedItem.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {MENU_CATEGORIES.find((cat) => cat.id === selectedItem.category)?.name} -{" "}
                    {selectedItem.price.toLocaleString()}đ
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Xóa món
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
