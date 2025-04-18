"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Utensils } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên đăng nhập và mật khẩu",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Mock authentication - in a real app, this would be an API call
      if (username === "admin" && password === "password") {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Store auth state (in a real app, use a proper auth solution)
        localStorage.setItem("isAuthenticated", "true")

        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn quay trở lại!",
        })

        router.push("/admin/dashboard")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      toast({
        title: "Đăng nhập thất bại",
        description: "Tên đăng nhập hoặc mật khẩu không đúng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Utensils className="h-10 w-10 text-rose-500" />
          </div>
          <CardTitle className="text-2xl">Đăng nhập Admin</CardTitle>
          <CardDescription>Đăng nhập để quản lý nhà hàng của bạn</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input id="username" placeholder="admin" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600" disabled={loading}>
              {loading ? (
                <>
                  <span className="mr-2">Đang đăng nhập</span>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </CardFooter>
        </form>
        <div className="p-6 pt-0 text-center text-sm">
          <p className="text-muted-foreground">
            Gợi ý: Sử dụng tên đăng nhập <span className="font-medium">admin</span> và mật khẩu{" "}
            <span className="font-medium">password</span>
          </p>
        </div>
      </Card>
    </div>
  )
}
