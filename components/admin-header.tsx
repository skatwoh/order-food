"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { BarChart3, ChevronDown, LogOut, Menu, Utensils, Users } from "lucide-react"

interface AdminHeaderProps {
  title: string
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    // Clear auth state
    localStorage.removeItem("isAuthenticated")

    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi hệ thống",
    })

    router.push("/admin")
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex items-center space-x-2 mb-8">
                <Utensils className="h-6 w-6 text-rose-500" />
                <span className="text-xl font-bold">FoodOrder</span>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Tổng quan</span>
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ChevronDown className="h-5 w-5" />
                  <span>Quản lý đơn hàng</span>
                </Link>
                <Link
                  href="/admin/menu"
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Utensils className="h-5 w-5" />
                  <span>Quản lý thực đơn</span>
                </Link>
                <Link
                  href="/admin/tables"
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  <span>Quản lý bàn</span>
                </Link>
              </nav>

              <div className="absolute bottom-4 w-full pr-8">
                <Button variant="outline" className="w-full justify-start text-red-500" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center space-x-2 mr-8">
            <Utensils className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold hidden md:inline">FoodOrder</span>
          </div>

          <nav className="hidden md:flex space-x-6">
            <Link href="/admin/dashboard" className="font-medium hover:text-rose-500">
              Tổng quan
            </Link>
            <Link href="/admin/orders" className="font-medium hover:text-rose-500">
              Quản lý đơn hàng
            </Link>
            <Link href="/admin/menu" className="font-medium hover:text-rose-500">
              Quản lý thực đơn
            </Link>
            <Link href="/admin/tables" className="font-medium hover:text-rose-500">
              Quản lý bàn
            </Link>
          </nav>
        </div>

        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-4 hidden md:block">{title}</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Đăng xuất</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
