"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Skip auth check on login page
    if (pathname === "/admin") {
      setIsLoading(false)
      return
    }

    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

    if (!isAuthenticated) {
      toast({
        title: "Không có quyền truy cập",
        description: "Vui lòng đăng nhập để tiếp tục",
        variant: "destructive",
      })
      router.push("/admin")
    } else {
      setIsLoading(false)
    }
  }, [pathname, router, toast])

  if (isLoading && pathname !== "/admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    )
  }

  return children
}
