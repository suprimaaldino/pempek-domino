"use client"

import { useState, useEffect } from "react"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../config/firebase"

export function useMenu() {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, "menu"), where("active", "==", true), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const menuData = []
        querySnapshot.forEach((doc) => {
          menuData.push({
            id: doc.id,
            ...doc.data(),
          })
        })
        setMenus(menuData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching menus:", error)
        setError(error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  return { menus, loading, error }
}
