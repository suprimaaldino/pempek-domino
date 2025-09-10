import { createContext, useContext, useState, useEffect } from "react"
import PropTypes from "prop-types"

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const savedCart = localStorage.getItem("pempek-domino-cart")
    if (savedCart) setCartItems(JSON.parse(savedCart))
  }, [])

  useEffect(() => {
    localStorage.setItem("pempek-domino-cart", JSON.stringify(cartItems))
  }, [cartItems])

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

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) return removeFromCart(itemId)
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const clearCart = () => setCartItems([])

  const getTotalPrice = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems }}
    >
      {children}
    </CartContext.Provider>
  )
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
