import { useState, useEffect, useRef } from 'react';
import { productService, categoryService } from '../services/adminService';
import api from '../services/api';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, X, Upload, Link as LinkIcon } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stockQuantity: '', categoryId: '', imageUrl: '' });
  const [imageMode, setImageMode] = useState('url');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [page]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, limit: 12 };
      if (search) params.search = search;
      const { data } = await productService.getProducts(params);
      const list = Array.isArray(data) ? data : (data.content || []);
      setProducts(list);
      setTotalPages(data.totalPages || Math.max(1, Math.ceil((data.totalElements || list.length) / 12)));
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await categoryService.getCategories();
      setCategories(Array.isArray(data) ? data : (data.content || []));
    } catch {}
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm({ name: '', description: '', price: '', stockQuantity: '', categoryId: '', imageUrl: '' });
    setImageMode('url');
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      stockQuantity: p.stockQuantity || p.stock || '',
      categoryId: p.categoryId || p.category?.id || '',
      imageUrl: p.imageUrl || p.image || '',
    });
    setImageMode('url');
    setShowModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stockQuantity) || 0, stockQuantity: parseInt(form.stockQuantity) || 0, categoryId: parseInt(form.categoryId) || null };
      if (editProduct) {
        await productService.update(editProduct.id, payload);
      } else {
        await productService.create(payload);
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      loadProducts();
    } catch {
      alert('Failed to delete product');
    }
  };

  const filtered = search
    ? products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Products</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <input className="form-input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 220, paddingLeft: 36 }} />
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Product</button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>ID</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j}><div className="skeleton" style={{ width: 70, height: 16 }} /></td>)}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>No products found</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>#{p.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--border-light)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {(p.imageUrl || p.image) ? <img src={p.imageUrl || p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>N/A</span>}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-purple">{p.categoryName || p.category?.name || '--'}</span></td>
                    <td style={{ fontWeight: 600 }}>{(p.price || 0).toLocaleString()} XAF</td>
                    <td>
                      <span className={`badge ${(p.stockQuantity || p.stock || 0) > 10 ? 'badge-success' : (p.stockQuantity || p.stock || 0) > 0 ? 'badge-warning' : 'badge-danger'}`}>
                        {p.stockQuantity || p.stock || 0}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}><Edit size={14} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
              <button key={i} className={page === i ? 'active' : ''} onClick={() => setPage(i)}>{i + 1}</button>
            ))}
            <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editProduct ? 'Edit Product' : 'Add Product'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Price (XAF)</label>
                <input className="form-input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input className="form-input" type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Product Image</label>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <button
                  type="button"
                  className={`btn btn-sm ${imageMode === 'url' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setImageMode('url')}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <LinkIcon size={14} /> URL
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${imageMode === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setImageMode('upload')}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Upload size={14} /> Upload
                </button>
              </div>
              {imageMode === 'url' ? (
                <input
                  className="form-input"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              ) : (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="file-upload-input"
                  />
                  <label
                    htmlFor="file-upload-input"
                    className="btn btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                  >
                    <Upload size={14} />
                    {uploading ? 'Uploading...' : 'Choose image'}
                  </label>
                </div>
              )}
              {form.imageUrl && (
                <div style={{ marginTop: 8, position: 'relative', display: 'inline-block' }}>
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-light)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, imageUrl: '' }))}
                    style={{ position: 'absolute', top: -6, right: -6, background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editProduct ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
