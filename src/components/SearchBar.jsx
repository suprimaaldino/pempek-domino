"use client"
import { Search, X } from "lucide-react"

function SearchBar({ searchQuery, onSearchChange }) {
  const handleClear = () => {
    onSearchChange("")
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <input
        type="text"
        placeholder="Cari pempek favorit..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="input-field pl-10 pr-10"
      />
      {searchQuery && (
        <button onClick={handleClear} className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      )}
    </div>
  )
}

export default SearchBar
