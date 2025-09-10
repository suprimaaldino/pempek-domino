
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "../contexts/CartContext"

function OrderSummary() {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart()

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (cartItems.length === 0) {
    return (
      <div className="card text-center py-8">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold mb-2">Keranjang Kosong</h3>
        <p className="text-muted-foreground">Silakan pilih menu terlebih dahulu</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>

      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
            <img
              src={
                item.images?.[0] ||
                `/placeholder.svg?height=60&width=60&query=${encodeURIComponent(item.name + " pempek") || "/placeholder.svg"}`
              }
              alt={item.name}
              className="w-15 h-15 object-cover rounded-lg"
            />

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{item.name}</h4>
              <p className="text-primary font-semibold">{formatPrice(item.price)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-8 text-center font-medium">{item.quantity}</span>

              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>

              <button
                onClick={() => removeFromCart(item.id)}
                className="w-8 h-8 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive flex items-center justify-center transition-colors ml-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary">{formatPrice(getTotalPrice())}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
