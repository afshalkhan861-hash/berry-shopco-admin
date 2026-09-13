"use client";
import React, { useState, useEffect } from "react";
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, Plus, Trash2, Package } from "lucide-react";

export default function ShopCoAdmin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "T-Shirts", stock: "20" });
  const [imageFile, setImageFile] = useState(null);

  const fetchAll = () => {
    fetch("http://localhost:5000/api/products").then(res => res.json()).then(setProducts);
    fetch("http://localhost:5000/api/orders").then(res => res.json()).then(setOrders);
    fetch("http://localhost:5000/api/users").then(res => res.json()).then(setUsers);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("stock", form.stock);
    if (imageFile) formData.append("image", imageFile);

    await fetch("http://localhost:5000/api/products", { method: "POST", body: formData });
    setForm({ name: "", price: "", category: "T-Shirts", stock: "20" });
    setImageFile(null);
    fetchAll();
    setActiveTab("products");
  };

  const handleDelete = async (id) => {
    await fetch("http://localhost:5000/api/products/" + id, { method: "DELETE" });
    fetchAll();
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-indigo-400 mb-8 flex items-center gap-2">
            <ShoppingBag className="w-8 h-8" /> SHOP.CO
          </h1>
          <nav className="space-y-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "products", label: "Products", icon: Package },
              { id: "add-product", label: "Add Product", icon: Plus },
              { id: "orders", label: "Orders", icon: ShoppingCart },
              { id: "users", label: "Customers", icon: Users },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    activeTab === item.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5" /> {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="border-t border-slate-800 pt-4 text-xs text-slate-500">
          Berry Admin UI • SHOP.CO Live
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">SHOP.CO Store Manager</h2>
            <p className="text-xs text-slate-400">Manage your e-commerce store inventory & sales</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">● Online</span>
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center font-sm justify-center">AK</div>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                <p className="text-indigo-100 text-xs font-medium uppercase">Total Revenue</p>
                <h3 className="text-3xl font-black mt-2">${totalRevenue + 12450}</h3>
                <p className="text-xs text-indigo-200 mt-2">+14% from last month</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-400 text-xs font-medium uppercase">Total Orders</p>
                <h3 className="text-3xl font-black mt-2 text-slate-800">{orders.length + 142}</h3>
                <p className="text-xs text-emerald-500 mt-2">12 Pending</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-400 text-xs font-medium uppercase">Total Products</p>
                <h3 className="text-3xl font-black mt-2 text-slate-800">{products.length}</h3>
                <p className="text-xs text-indigo-500 mt-2">Active in store</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-400 text-xs font-medium uppercase">Customers</p>
                <h3 className="text-3xl font-black mt-2 text-slate-800">{users.length + 86}</h3>
                <p className="text-xs text-emerald-500 mt-2">Active Users</p>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Latest SHOP.CO Inventory</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {products.slice(0, 4).map(p => (
                  <div key={p.id} className="border border-slate-100 rounded-xl p-3 flex flex-col justify-between bg-slate-50/50">
                    <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                    <h4 className="font-bold text-sm text-slate-800 truncate">{p.name}</h4>
                    <p className="text-indigo-600 font-extrabold text-sm mt-1">${p.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">SHOP.CO Products List</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs text-slate-400 uppercase">
                  <th className="py-3">Item</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Stock</th>
                  <th className="py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 flex items-center gap-3">
                      <img src={p.image} className="w-10 h-10 object-cover rounded-lg" />
                      <span className="font-semibold text-slate-800">{p.name}</span>
                    </td>
                    <td className="py-3 text-slate-500">{p.category}</td>
                    <td className="py-3 font-bold text-slate-800">${p.price}</td>
                    <td className="py-3 text-slate-500">{p.stock} pcs</td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Product Tab */}
        {activeTab === "add-product" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-lg">
            <h3 className="font-bold text-slate-800 mb-4">Add New Item to SHOP.CO</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Product Title</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Heavy Weight Hoodie" className="w-full mt-1 p-3 border rounded-xl text-sm outline-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Price ($) </label>
                  <input required type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="120" className="w-full mt-1 p-3 border rounded-xl text-sm outline-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full mt-1 p-3 border rounded-xl text-sm outline-indigo-500">
                    <option>T-Shirts</option>
                    <option>Jeans</option>
                    <option>Shirts</option>
                    <option>Hoodies</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Upload Image</label>
                <input type="file" onChange={e => setImageFile(e.target.files[0])} className="w-full mt-1 p-2 border rounded-xl text-sm" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition">
                Publish Product
              </button>
            </form>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Recent Customer Orders</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs text-slate-400 uppercase">
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Items</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {orders.map(o => (
                  <tr key={o.id}>
                    <td className="py-3 font-mono text-indigo-600 font-bold">{o.id}</td>
                    <td className="py-3 font-medium">{o.customer}</td>
                    <td className="py-3 text-slate-500">{o.items}</td>
                    <td className="py-3 font-bold">${o.total}</td>
                    <td className="py-3">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">SHOP.CO Registered Users</h3>
            <div className="space-y-3">
              {users.map(u => (
                <div key={u.id} className="flex justify-between items-center p-3 border rounded-xl">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{u.name}</h4>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}