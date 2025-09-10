"use client"
import { MapPin, Phone, User, MessageSquare, Truck, Store } from "lucide-react"

function CustomerForm({ onFormChange, formData, errors }) {
  const handleInputChange = (field, value) => {
    onFormChange({
      ...formData,
      [field]: value,
    })
  }

  const handleDeliveryMethodChange = (method) => {
    onFormChange({
      ...formData,
      deliveryMethod: method,
    })
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-6">Informasi Pelanggan</h2>

      <div className="space-y-4">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nama Lengkap *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Masukkan nama lengkap"
            className={`input-field ${errors.name ? "border-destructive focus:ring-destructive" : ""}`}
          />
          {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Nomor HP */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Nomor HP *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="08xxxxxxxxxx"
            className={`input-field ${errors.phone ? "border-destructive focus:ring-destructive" : ""}`}
          />
          {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Metode Pengiriman */}
        <div>
          <label className="block text-sm font-medium mb-3">Metode Pengiriman *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDeliveryMethodChange("pickup")}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                formData.deliveryMethod === "pickup"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5" />
                <div>
                  <div className="font-medium">Ambil di Tempat</div>
                  <div className="text-sm text-muted-foreground">Gratis</div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDeliveryMethodChange("delivery")}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                formData.deliveryMethod === "delivery"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5" />
                <div>
                  <div className="font-medium">Antar ke Alamat</div>
                  <div className="text-sm text-muted-foreground">Rp 5.000</div>
                </div>
              </div>
            </button>
          </div>
          {errors.deliveryMethod && <p className="text-destructive text-sm mt-1">{errors.deliveryMethod}</p>}
        </div>

        {/* Alamat (hanya jika delivery) */}
        {formData.deliveryMethod === "delivery" && (
          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Alamat Lengkap *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Masukkan alamat lengkap dengan patokan yang jelas"
              rows={3}
              className={`input-field resize-none ${errors.address ? "border-destructive focus:ring-destructive" : ""}`}
            />
            {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
          </div>
        )}

        {/* Catatan */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Catatan (Opsional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Tingkat kepedasan, permintaan khusus, dll."
            rows={2}
            className="input-field resize-none"
          />
        </div>
      </div>
    </div>
  )
}

export default CustomerForm
