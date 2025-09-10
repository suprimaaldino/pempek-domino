"use client"

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

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Login dengan email dan password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Login dengan Google
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  // Logout
  const logout = () => {
    return signOut(auth)
  }

  // Cek apakah user adalah admin
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      await checkAdminStatus(user)
      setLoading(false)
    })

    return unsubscribe
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
