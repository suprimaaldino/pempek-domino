"use client"
import { ShoppingCart } from "lucide-react"
import { useCart } from "../contexts/CartContext"
import { useNavigate } from "react-router-dom"

function CartButton() {
  const { getTotalItems, getTotalPrice } = useCart()
  const navigate = useNavigate()
  const totalItems = getTotalItems()

  if (totalItems === 0) return null

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <button
        onClick={() => navigate("/order")}
        className="w-full btn-primary flex items-center justify-between p-4 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          </div>
          <span className="font-semibold">Lihat Keranjang</span>
        </div>
        <span className="font-bold">{formatPrice(getTotalPrice())}</span>
      </button>
    </div>
  )
}

export default CartButton
