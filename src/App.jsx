import { useState, useEffect } from "react";

const API = "http://localhost:5050/products";

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", imageUrl: "", desc: "" });
  const [editingId, setEditingId] = useState(null);
  const [productId, setProductId] = useState("");
  const [error, setError] = useState("");

  // READ - sab products load karo
  const loadProducts = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Products load nahi huay");
      setProducts(await res.json());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, price, imageUrl, desc } = form;
    if (!name || !price || !imageUrl || !desc) {
      setError("Sab fields required hain");
      return;
    }

    try {
      const res = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: Number(price), imageUrl, desc,id:productId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Request fail ho gayi");
      }

      setForm({ name: "", price: "", imageUrl: "", desc: "" });
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // UPDATE ke liye form mein data bharo
  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      desc: product.desc,
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete fail ho gaya");
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "30px auto", fontFamily: "sans-serif" }}>
      <h1>Products Manager</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Form: Save aur Update dono yahan se hota hai */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>{editingId ? `Update Product #${editingId}` : "New Product"}</h2>
        <input
          placeholder="id"
          value={productId}
          onChange={(e) => setProductId(e.target.value )}
          style={styles.input}
        />
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={styles.input}
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          style={styles.input}
        />
        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          style={styles.input}
        />
        <textarea
          placeholder="Description"
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          style={{ ...styles.input, height: 60 }}
        />
        <div>
          <button type="submit" style={styles.button}>
            {editingId ? "Update" : "Save"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", price: "", imageUrl: "", desc: "" });
              }}
              style={{ ...styles.button, background: "#888" }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Products List */}
      <h2>Products</h2>
      {products.length === 0 && <p>Koi product nahi hai.</p>}
      {products.map((p) => (
        <div key={p.id} style={styles.card}>
          <img src={p.imageUrl} alt={p.name} width={80} height={80} style={{ objectFit: "cover" }} />
          <div style={{ flex: 1, marginLeft: 12 }}>
            <h3 style={{ margin: 0 }}>{p.name}</h3>
            <p style={{ margin: "4px 0" }}>Rs. {p.price}</p>
            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>{p.desc}</p>
          </div>
          <div>
            <button onClick={() => handleEdit(p)} style={styles.button}>Edit</button>
            <button
              onClick={() => handleDelete(p.id)}
              style={{ ...styles.button, background: "#d9534f", marginLeft: 8 }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 16,
    border: "1px solid #ddd",
    borderRadius: 8,
    marginBottom: 20,
  },
  input: { padding: 8, fontSize: 14, border: "1px solid #ccc", borderRadius: 4 },
  button: {
    padding: "8px 16px",
    background: "#0d6efd",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  card: {
    display: "flex",
    alignItems: "center",
    padding: 12,
    border: "1px solid #eee",
    borderRadius: 8,
    marginBottom: 10,
  },
};