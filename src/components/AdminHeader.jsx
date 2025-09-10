"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, User, Settings, ChevronDown } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

function AdminHeader({ title, subtitle }) {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium">{currentUser?.email}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-20">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-border mb-2">
                      <p className="text-sm font-medium">{currentUser?.email}</p>
                      <p className="text-xs text-muted-foreground">Administrator</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowDropdown(false)
                        // Navigate to settings if needed
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Pengaturan</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowDropdown(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
