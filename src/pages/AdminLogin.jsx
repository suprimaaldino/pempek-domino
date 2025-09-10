"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, Chrome, ArrowLeft } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"

function AdminLogin() {
  const navigate = useNavigate()
  const { login, loginWithGoogle, currentUser, isAdmin } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect jika sudah login sebagai admin
  useEffect(() => {
    if (currentUser && isAdmin) {
      navigate("/admin")
    }
  }, [currentUser, isAdmin, navigate])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error saat user mulai mengetik
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email wajib diisi")
      return false
    }

    if (!formData.email.includes("@")) {
      setError("Format email tidak valid")
      return false
    }

    if (!formData.password.trim()) {
      setError("Password wajib diisi")
      return false
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter")
      return false
    }

    return true
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      await login(formData.email, formData.password)
      // AuthContext akan handle redirect otomatis
    } catch (err) {
      console.error("Login error:", err)

      // Handle specific Firebase auth errors
      switch (err.code) {
        case "auth/user-not-found":
          setError("Email tidak terdaftar")
          break
        case "auth/wrong-password":
          setError("Password salah")
          break
        case "auth/invalid-email":
          setError("Format email tidak valid")
          break
        case "auth/user-disabled":
          setError("Akun telah dinonaktifkan")
          break
        case "auth/too-many-requests":
          setError("Terlalu banyak percobaan login. Coba lagi nanti")
          break
        default:
          setError("Terjadi kesalahan saat login. Silakan coba lagi")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      await loginWithGoogle()
      // AuthContext akan handle redirect otomatis
    } catch (err) {
      console.error("Google login error:", err)

      switch (err.code) {
        case "auth/popup-closed-by-user":
          setError("Login dibatalkan")
          break
        case "auth/popup-blocked":
          setError("Popup diblokir browser. Izinkan popup dan coba lagi")
          break
        default:
          setError("Terjadi kesalahan saat login dengan Google")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground">Masuk ke dashboard admin Pempek Domino</p>
        </div>

        {/* Login Form */}
        <div className="card">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Admin
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="admin@pempekdomino.com"
                className="input-field"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Masukkan password"
                  className="input-field pr-12"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Masuk...</span>
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">atau</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome className="w-5 h-5" />
            <span>Masuk dengan Google</span>
          </button>

          {/* Development Info */}
          {import.meta.env.DEV && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Development Mode:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Email: {import.meta.env.VITE_ADMIN_EMAIL || "admin@pempekdomino.com"}</p>
                <p>Password: {import.meta.env.VITE_ADMIN_PASSWORD || "admin123"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">Hanya admin yang memiliki akses ke dashboard ini</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
