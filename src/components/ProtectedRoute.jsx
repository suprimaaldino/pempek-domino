
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function ProtectedRoute({ children }) {
  const { currentUser, isAdmin } = useAuth()

  // Jika belum login, redirect ke halaman login admin
  if (!currentUser) {
    return <Navigate to="/admin/login" />
  }

  // Jika sudah login tapi bukan admin, redirect ke homepage
  if (!isAdmin) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}

export default ProtectedRoute
