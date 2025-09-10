"use client"

import { useState, useMemo } from "react"
import { MapPin, Clock, Star } from "lucide-react"
import { useMenu } from "../hooks/useMenu"
import MenuCard from "../components/MenuCard"
import CategoryFilter from "../components/CategoryFilter"
import SearchBar from "../components/SearchBar"
import CartButton from "../components/CartButton"
import LoadingSpinner from "../components/LoadingSpinner"

function HomePage() {
  const { menus, loading, error } = useMenu()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter menu berdasarkan kategori dan pencarian
  const filteredMenus = useMemo(() => {
    let filtered = menus

    // Filter berdasarkan kategori
    if (selectedCategory !== "all") {
      filtered = filtered.filter((menu) => menu.category === selectedCategory)
    }

    // Filter berdasarkan pencarian
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (menu) => menu.name.toLowerCase().includes(query) || menu.description.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [menus, selectedCategory, searchQuery])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Terjadi kesalahan saat memuat menu</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/pempek-palembang-traditional-food-hero-image.jpg" alt="Pempek Palembang" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Pempek Domino</h1>
            <p className="text-lg md:text-xl mb-6 text-balance opacity-90">
              Cita Rasa Asli Palembang dengan Resep Turun Temurun
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Palembang, Sumatera Selatan</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Buka 08:00 - 22:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.8 (2.1k+ ulasan)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>
      </section>

      {/* Menu Grid Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {selectedCategory === "all"
              ? "Semua Menu"
              : selectedCategory === "pempek-isi"
                ? "Pempek Isi"
                : selectedCategory === "pempek-polos"
                  ? "Pempek Polos"
                  : selectedCategory === "pempek-goreng"
                    ? "Pempek Goreng"
                    : "Pelengkap"}
          </h2>
          <p className="text-muted-foreground">
            {searchQuery
              ? `Menampilkan ${filteredMenus.length} hasil untuk "${searchQuery}"`
              : `${filteredMenus.length} menu tersedia`}
          </p>
        </div>

        {filteredMenus.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Menu tidak ditemukan</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Coba kata kunci lain atau ubah filter kategori" : "Belum ada menu di kategori ini"}
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="btn-secondary">
                Hapus Pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} />
            ))}
          </div>
        )}
      </section>

      {/* Floating Cart Button */}
      <CartButton />
    </div>
  )
}

export default HomePage
