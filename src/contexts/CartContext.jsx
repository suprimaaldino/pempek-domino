"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  // Load cart dari localStorage saat komponen dimount
  useEffect(() => {
    const savedCart = localStorage.getItem("pempek-domino-cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Simpan cart ke localStorage setiap kali cartItems berubah
  useEffect(() => {
    localStorage.setItem("pempek-domino-cart", JSON.stringify(cartItems))
  }, [cartItems])

  // Tambah item ke keranjang
  const addToCart = (menuItem, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === menuItem.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === menuItem.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        return [...prevItems, { ...menuItem, quantity }]
      }
    })
  }

  // Update quantity item di keranjang
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  // Hapus item dari keranjang
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  // Kosongkan keranjang
  const clearCart = () => {
    setCartItems([])
  }

  // Hitung total harga
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Hitung total item
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
