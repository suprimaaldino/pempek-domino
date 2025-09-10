"use client"

import { useState } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../config/firebase"

export function useOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateOrderNumber = () => {
    const now = new Date()
    const date = now.toISOString().slice(0, 10).replace(/-/g, "")
    const time = now.getTime().toString().slice(-4)
    return `PD-${date}-${time}`
  }

  const createOrder = async (orderData) => {
    setLoading(true)
    setError(null)

    try {
      const orderNumber = generateOrderNumber()

      const order = {
        orderNumber,
        items: orderData.items,
        total: orderData.total,
        customer: {
          name: orderData.customer.name,
          phone: orderData.customer.phone,
          address: orderData.customer.address || "",
        },
        deliveryMethod: orderData.deliveryMethod,
        status: "pending",
        notes: orderData.notes || "",
        createdAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "orders"), order)

      setLoading(false)
      return {
        success: true,
        orderId: docRef.id,
        orderNumber,
      }
    } catch (err) {
      console.error("Error creating order:", err)
      setError(err.message)
      setLoading(false)
      return {
        success: false,
        error: err.message,
      }
    }
  }

  return {
    createOrder,
    loading,
    error,
  }
}
