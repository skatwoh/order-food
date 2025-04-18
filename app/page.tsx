"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils } from "lucide-react"

export default function Home() {
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)

  useEffect(() => {
    // Kiểm tra xem có đơn hàng gần nhất không
    const storedOrderId = localStorage.getItem("lastOrderId")
    if (storedOrderId) {
      setLastOrderId(storedOrderId)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Utensils className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold">FoodOrder</span>
          </div>
          {/* <Link href="/admin">
            <Button variant="outline" size="sm">
              Đăng nhập Admin
            </Button>
          </Link> */}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Chào mừng đến với nhà hàng của chúng tôi</h1>
          <p className="text-xl text-gray-600 mb-8">Đặt món ăn trực tiếp từ bàn của bạn</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Đặt món ăn</CardTitle>
                <CardDescription>Đặt món ăn trực tiếp từ bàn của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <Utensils className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/order" className="w-full">
                  <Button className="w-full bg-rose-500 hover:bg-rose-600">Đặt món ngay</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Xem trạng thái đơn hàng</CardTitle>
                <CardDescription>Kiểm tra trạng thái đơn hàng của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <Utensils className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Link href="/status" className="w-full">
                  <Button variant="outline" className="w-full">
                    Xem trạng thái
                  </Button>
                </Link>
                {lastOrderId && (
                  <Link href={`/status?orderId=${lastOrderId}`} className="w-full">
                    <Button variant="secondary" className="w-full">
                      Xem đơn hàng gần nhất
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FoodOrder. Đã đăng ký bản quyền.
        </div>
      </footer>
    </div>
  )
}
