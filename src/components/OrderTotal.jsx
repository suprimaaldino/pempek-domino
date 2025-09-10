"use client"
import { useCart } from "../contexts/CartContext"

function OrderTotal({ deliveryMethod }) {
  const { getTotalPrice } = useCart()

  const subtotal = getTotalPrice()
  const deliveryFee = deliveryMethod === "delivery" ? 5000 : 0
  const total = subtotal + deliveryFee

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Rincian Pembayaran</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Biaya Pengiriman</span>
          <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "Gratis"}</span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Pembayaran</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderTotal
