"use client"

const categories = [
  { id: "all", name: "Semua", icon: "🍽️" },
  { id: "pempek-isi", name: "Pempek Isi", icon: "🥟" },
  { id: "pempek-polos", name: "Pempek Polos", icon: "🍤" },
  { id: "pempek-goreng", name: "Pempek Goreng", icon: "🔥" },
  { id: "pelengkap", name: "Pelengkap", icon: "🥤" },
]

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`category-chip whitespace-nowrap flex items-center gap-2 ${
            selectedCategory === category.id ? "category-chip-active" : "category-chip-inactive"
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
