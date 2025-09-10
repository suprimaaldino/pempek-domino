import { createContext, useContext, useState, useEffect } from "react"
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../config/firebase"

const AuthContext = createContext({
  currentUser: null,
  isAdmin: false,
  login: () => Promise.resolve(),
  loginWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  checkAdminStatus: () => Promise.resolve(false),
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider())
  const logout = () => signOut(auth)

  const checkAdminStatus = async (user) => {
    if (!user) {
      setIsAdmin(false)
      return false
    }
    try {
      const adminDoc = await getDoc(doc(db, "admins", user.uid))
      const adminStatus = adminDoc.exists() && adminDoc.data().role === "admin"
      setIsAdmin(adminStatus)
      return adminStatus
    } catch (error) {
      console.error("Error checking admin status:", error)
      setIsAdmin(false)
      return false
    }
  }

  useEffect(() => {
    const handleAuthChange = async (user) => {
      setCurrentUser(user)
      await checkAdminStatus(user)
      setLoading(false)
    }
    const unsubscribe = onAuthStateChanged(auth, handleAuthChange)
    return () => unsubscribe()
  }, [])

  const value = {
    currentUser,
    isAdmin,
    login,
    loginWithGoogle,
    logout,
    checkAdminStatus,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
