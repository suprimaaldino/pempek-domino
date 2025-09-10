"use client"

import AdminHeader from "../components/AdminHeader"

function AdminPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader title="Dashboard Admin" subtitle="Kelola menu dan pesanan Pempek Domino" />

      <div className="max-w-7xl mx-auto p-4">
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold mb-2">Selamat Datang, Admin!</h2>
          <p className="text-muted-foreground mb-6">Dashboard admin akan dibangun di tahap selanjutnya</p>
          <div className="text-sm text-muted-foreground">
            Fitur yang akan tersedia: Manajemen Menu, Kelola Pesanan, Laporan Penjualan
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
