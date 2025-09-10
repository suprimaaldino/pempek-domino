import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useCart } from "../contexts/CartContext"
import { useOrder } from "../hooks/useOrder"
import OrderSummary from "../components/OrderSummary"
import CustomerForm from "../components/CustomerForm"
import OrderTotal from "../components/OrderTotal"
import LoadingSpinner from "../components/LoadingSpinner"

function OrderPage() {
  const navigate = useNavigate()
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { createOrder, loading } = useOrder()

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryMethod: "pickup",
    notes: "",
  })

  const [errors, setErrors] = useState({})
  const [orderSuccess, setOrderSuccess] = useState(null)

  // Redirect jika keranjang kosong
  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate("/")
    }
  }, [cartItems, navigate, orderSuccess])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nama lengkap wajib diisi"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor HP wajib diisi"
    } else if (!/^08\d{8,11}$/.test(formData.phone)) {
      newErrors.phone = "Format nomor HP tidak valid (contoh: 08123456789)"
    }

    if (!formData.deliveryMethod) {
      newErrors.deliveryMethod = "Pilih metode pengiriman"
    }

    if (formData.deliveryMethod === "delivery" && !formData.address.trim()) {
      newErrors.address = "Alamat wajib diisi untuk pengiriman"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      return
    }

    const subtotal = getTotalPrice()
    const deliveryFee = formData.deliveryMethod === "delivery" ? 5000 : 0
    const total = subtotal + deliveryFee

    const orderData = {
      items: cartItems.map((item) => ({
        menuId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      },
      deliveryMethod: formData.deliveryMethod,
      notes: formData.notes,
    }

    const result = await createOrder(orderData)

    if (result.success) {
      setOrderSuccess({
        orderNumber: result.orderNumber,
        orderId: result.orderId,
      })
      clearCart()
    }
  }

  // Tampilan sukses order
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Pesanan Berhasil!</h1>
            <p className="text-muted-foreground mb-4">Pesanan Anda telah diterima dan sedang diproses</p>

            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground mb-1">Nomor Pesanan</p>
              <p className="font-bold text-lg">{orderSuccess.orderNumber}</p>
            </div>

            <div className="space-y-3">
              <button onClick={() => navigate("/")} className="btn-primary w-full">
                Kembali ke Menu
              </button>
              <p className="text-xs text-muted-foreground">
                Kami akan menghubungi Anda segera untuk konfirmasi pesanan
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Konfirmasi Pesanan</h1>
              <p className="text-sm text-muted-foreground">Periksa pesanan dan lengkapi data Anda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <OrderSummary />
            <CustomerForm formData={formData} onFormChange={setFormData} errors={errors} />
          </div>

          {/* Summary Section */}
          <div className="space-y-6">
            <OrderTotal deliveryMethod={formData.deliveryMethod} />

            <button
              onClick={handleSubmitOrder}
              disabled={loading || cartItems.length === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Memproses...</span>
                </>
              ) : (
                "Konfirmasi Pesanan"
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPage
