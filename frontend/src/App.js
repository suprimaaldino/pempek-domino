import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);

  // Customer form data
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Admin login data
  const [adminLogin, setAdminLogin] = useState({
    username: '',
    password: ''
  });

  // Product form data
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category_id: '',
    category_name: '',
    image_url: '',
    stock: '',
    description: ''
  });

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const url = selectedCategory 
        ? `${API_BASE}/api/products?category=${selectedCategory}`
        : `${API_BASE}/api/products`;
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadAdminOrders = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await response.json();
      setAdminOrders(data);
    } catch (error) {
      console.error('Error loading admin orders:', error);
    }
  };

  const loadAdminProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/products`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await response.json();
      setAdminProducts(data);
    } catch (error) {
      console.error('Error loading admin products:', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  useEffect(() => {
    if (isAdmin && adminToken) {
      loadAdminOrders();
      loadAdminProducts();
    }
  }, [isAdmin, adminToken]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, subtotal: product.price }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
        : item
    ));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const submitOrder = async () => {
    if (!customerData.name || !customerData.phone || !customerData.address) {
      alert('Mohon lengkapi semua data pelanggan');
      return;
    }

    if (cart.length === 0) {
      alert('Keranjang kosong');
      return;
    }

    try {
      const orderData = {
        customer_name: customerData.name,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        items: cart,
        total_amount: getTotalAmount()
      };

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Pesanan berhasil dikirim! Terima kasih.');
        setCart([]);
        setCustomerData({ name: '', phone: '', address: '' });
        setCurrentPage('home');
      } else {
        throw new Error(result.detail || 'Gagal mengirim pesanan');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Gagal mengirim pesanan. Silakan coba lagi.');
    }
  };

  const handleAdminLogin = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminLogin)
      });

      const result = await response.json();
      
      if (response.ok) {
        setAdminToken(result.access_token);
        setIsAdmin(true);
        setCurrentPage('admin');
        setAdminLogin({ username: '', password: '' });
      } else {
        throw new Error(result.detail || 'Login gagal');
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      alert('Login gagal. Periksa username dan password.');
    }
  };

  const handleCreateProduct = async () => {
    try {
      if (!productForm.name || !productForm.price || !productForm.category_id) {
        alert('Mohon lengkapi data produk');
        return;
      }

      const selectedCat = categories.find(cat => cat.id === productForm.category_id);
      const productData = {
        ...productForm,
        price: parseInt(productForm.price),
        stock: parseInt(productForm.stock) || 100,
        category_name: selectedCat?.name || ''
      };

      const response = await fetch(`${API_BASE}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Produk berhasil ditambahkan!');
        setProductForm({
          name: '',
          price: '',
          category_id: '',
          category_name: '',
          image_url: '',
          stock: '',
          description: ''
        });
        loadAdminProducts();
        loadProducts();
      } else {
        throw new Error(result.detail || 'Gagal menambahkan produk');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Gagal menambahkan produk');
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        alert('Produk berhasil dihapus!');
        loadAdminProducts();
        loadProducts();
      } else {
        throw new Error('Gagal menghapus produk');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Gagal menghapus produk');
    }
  };

  const adminLogout = () => {
    setIsAdmin(false);
    setAdminToken('');
    setCurrentPage('home');
  };

  // Render different pages
  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <div className="text-white font-bold text-sm">DOMINO</div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Pempek Domino</h1>
            </div>
            <nav className="flex space-x-6">
              <button onClick={() => setCurrentPage('home')} className="text-gray-600 hover:text-orange-600 font-medium">Home</button>
              <button onClick={() => setCurrentPage('menu')} className="text-gray-600 hover:text-orange-600 font-medium">Menu</button>
              <button onClick={() => setCurrentPage('admin-login')} className="text-gray-600 hover:text-orange-600 font-medium">Admin</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1587907988134-94b4d1c3e40e" 
              alt="Pempek Domino" 
              className="w-full h-96 object-cover rounded-2xl shadow-2xl mb-8"
            />
            <h2 className="text-5xl font-bold text-gray-800 mb-4">Pempek Domino</h2>
            <p className="text-xl text-gray-600 mb-8">Fresh & Tasty Every Day!</p>
            <button 
              onClick={() => setCurrentPage('menu')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transform transition hover:scale-105"
            >
              Lihat Menu
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Resep Tradisional</h3>
              <p className="text-gray-600">Dibuat dengan resep turun temurun khas Palembang</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pengiriman Cepat</h3>
              <p className="text-gray-600">Notifikasi otomatis dan pelayanan yang cepat</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Selalu Fresh</h3>
              <p className="text-gray-600">Dibuat fresh setiap hari dengan bahan berkualitas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderMenuPage = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <div className="text-white font-bold text-sm">DOMINO</div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Menu Pempek</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setCurrentPage('home')} className="text-gray-600 hover:text-orange-600">Home</button>
              <button 
                onClick={() => setShowCart(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <span>Keranjang ({cart.length})</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full ${selectedCategory === '' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              Semua
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full ${selectedCategory === category.name ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">Rp {product.price.toLocaleString()}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Pesan
                  </button>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Stok: {product.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Keranjang Belanja</h2>
                <button 
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Keranjang kosong</p>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-gray-600">Rp {item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">Rp {item.subtotal.toLocaleString()}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 text-sm hover:text-red-700"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Form */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Data Pelanggan</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Nama Lengkap"
                        value={customerData.name}
                        onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Nomor HP"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <textarea
                        placeholder="Alamat Lengkap"
                        value={customerData.address}
                        onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-orange-600">Rp {getTotalAmount().toLocaleString()}</span>
                    </div>
                    <button
                      onClick={submitOrder}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold mt-4"
                    >
                      Kirim Pesanan
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAdminLoginPage = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="text-white font-bold">ADMIN</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Login Admin</h2>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={adminLogin.username}
            onChange={(e) => setAdminLogin({...adminLogin, username: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={adminLogin.password}
            onChange={(e) => setAdminLogin({...adminLogin, password: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            onClick={handleAdminLogin}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
          >
            Login
          </button>
        </div>

        <div className="text-center mt-6">
          <button 
            onClick={() => setCurrentPage('home')}
            className="text-gray-600 hover:text-orange-600"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdminPage = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <button 
              onClick={adminLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Orders Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Pesanan Terbaru</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {adminOrders.map(order => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{order.customer_name}</h3>
                    <span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">📱 {order.customer_phone}</p>
                  <p className="text-sm text-gray-600 mb-2">📍 {order.customer_address}</p>
                  <div className="text-lg font-bold text-orange-600">
                    Total: Rp {order.total_amount.toLocaleString()}
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Management */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Kelola Produk</h2>
            
            {/* Add Product Form */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">Tambah Produk Baru</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nama Produk"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Harga"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <select
                  value={productForm.category_id}
                  onChange={(e) => setProductForm({...productForm, category_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="url"
                  placeholder="URL Gambar"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Stok"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <textarea
                  placeholder="Deskripsi"
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={handleCreateProduct}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold"
                >
                  Tambah Produk
                </button>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {adminProducts.map(product => (
                <div key={product.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-600">Rp {product.price.toLocaleString()} | Stok: {product.stock}</p>
                  </div>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  if (currentPage === 'home') return renderHomePage();
  if (currentPage === 'menu') return renderMenuPage();
  if (currentPage === 'admin-login') return renderAdminLoginPage();
  if (currentPage === 'admin' && isAdmin) return renderAdminPage();
  
  return renderHomePage();
}

export default App;