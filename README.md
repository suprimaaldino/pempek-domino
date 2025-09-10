# Pempek Domino - Aplikasi Web Usaha Makanan

Aplikasi web modern untuk usaha pempek dengan fitur pemesanan online dan dashboard admin.

## 🚀 Fitur Utama

### Untuk Pelanggan
- **Homepage & Menu**: Tampilan menu pempek dengan kategori, filter, dan pencarian
- **Keranjang Belanja**: Sistem keranjang yang tersimpan di localStorage
- **Pemesanan**: Checkout satu halaman dengan form pelanggan lengkap
- **Mobile-First**: Desain responsif yang dioptimalkan untuk mobile

### Untuk Admin
- **Autentikasi**: Login dengan email/password atau Google
- **Manajemen Menu**: CRUD menu dengan upload gambar
- **Manajemen Pesanan**: Lihat dan update status pesanan
- **Dashboard**: Overview bisnis dan statistik

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting)
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Icons**: Lucide React

## 📦 Instalasi

### 1. Clone Repository

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Firebase
1. Buat project baru di [Firebase Console](https://console.firebase.google.com)
2. Aktifkan Authentication, Firestore, dan Storage
3. Copy konfigurasi Firebase ke file `.env`

### 4. Konfigurasi Environment Variables
\`\`\`bash
cp .env.example .env
\`\`\`

Edit file `.env` dan isi dengan konfigurasi Firebase Anda:
\`\`\`env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
\`\`\`

### 5. Setup Firebase Rules
\`\`\`bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules  
firebase deploy --only storage
\`\`\`

### 6. Buat Admin User
Tambahkan dokumen di Firestore collection `admins`:
\`\`\`javascript
// Collection: admins
// Document ID: [USER_UID_FROM_AUTH]
{
  role: "admin",
  email: "admin@pempekdomino.com",
  createdAt: new Date()
}
\`\`\`

## 🚀 Development

\`\`\`bash
# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Preview build
npm run preview
\`\`\`

## 📱 Deploy ke Firebase Hosting

### 1. Install Firebase CLI
\`\`\`bash
npm install -g firebase-tools
\`\`\`

### 2. Login ke Firebase
\`\`\`bash
firebase login
\`\`\`

### 3. Inisialisasi Firebase Project
\`\`\`bash
firebase init
\`\`\`
Pilih:
- Hosting
- Firestore
- Storage

### 4. Build dan Deploy
\`\`\`bash
# Build aplikasi
npm run build

# Deploy ke Firebase Hosting
firebase deploy
\`\`\`

## 📊 Struktur Database

### Collection: `menu`
\`\`\`javascript
{
  id: "menu_id",
  name: "Pempek Kapal Selam",
  description: "Pempek isi telur dengan kuah cuko asli",
  price: 15000,
  category: "pempek-isi",
  images: ["https://storage.googleapis.com/..."],
  stock: 50,
  active: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
\`\`\`

### Collection: `orders`
\`\`\`javascript
{
  id: "order_id", 
  orderNumber: "PD-20241201-001",
  items: [
    {
      menuId: "menu_id",
      name: "Pempek Kapal Selam", 
      quantity: 2,
      price: 15000
    }
  ],
  total: 30000,
  customer: {
    name: "John Doe",
    phone: "08123456789", 
    address: "Jl. Sudirman No. 123"
  },
  deliveryMethod: "delivery", // "pickup" atau "delivery"
  status: "pending", // "pending", "preparing", "ready", "completed", "cancelled"
  notes: "Pedas sedang",
  createdAt: Timestamp
}
\`\`\`

### Collection: `admins`
\`\`\`javascript
{
  id: "user_uid",
  role: "admin",
  email: "admin@pempekdomino.com",
  createdAt: Timestamp
}
\`\`\`

## 🎨 Kategori Menu

- `pempek-isi`: Pempek Kapal Selam, Pempek Telur Kecil
- `pempek-polos`: Pempek Lenjer, Pempek Bulat
- `pempek-goreng`: Pempek Panggang, Pempek Bakar
- `pelengkap`: Kerupuk, Es Campur, Teh Manis

## 🔒 Security Rules

Aplikasi menggunakan Firebase Security Rules untuk:
- Semua orang bisa baca menu
- User login bisa buat pesanan
- Hanya admin bisa kelola menu dan lihat pesanan
- Hanya admin bisa upload gambar

## 📝 Contoh Data Menu

\`\`\`javascript
// Contoh data untuk testing
const sampleMenus = [
  {
    name: "Pempek Kapal Selam",
    description: "Pempek isi telur ayam dengan kuah cuko asli Palembang",
    price: 15000,
    category: "pempek-isi",
    stock: 50,
    active: true
  },
  {
    name: "Pempek Lenjer", 
    description: "Pempek polos bentuk panjang, cocok untuk segala usia",
    price: 8000,
    category: "pempek-polos", 
    stock: 100,
    active: true
  }
]
\`\`\`

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Pempek Domino - [@aldinoaja](https://instagram.com/aldinoaja)

Project Link: [https://github.com/suprimaaldino/pempek-domino](https://github.com/suprimaaldino/pempek-domino)

Whatsapp: [https://wa.me/628170103907](https://wa.me/628170103907)