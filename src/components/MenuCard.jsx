"use client"
import { ShoppingCart, Star } from "lucide-react"
import { useCart } from "../contexts/CartContext"

function MenuCard({ menu }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(menu, 1)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="card group hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img
          src={
            menu.images?.[0] ||
            `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(menu.name + " pempek palembang")}`
          }
          alt={menu.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {menu.stock <= 5 && menu.stock > 0 && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-medium">
            Stok Terbatas
          </div>
        )}
        {menu.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Habis</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-balance leading-tight">{menu.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{menu.description}</p>

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <p className="text-xl font-bold text-primary">{formatPrice(menu.price)}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
              <span>•</span>
              <span>Stok: {menu.stock}</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={menu.stock === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MenuCard
