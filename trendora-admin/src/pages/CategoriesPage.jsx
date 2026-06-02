import { useState, useEffect } from 'react';
import { categoryService } from '../services/adminService';
import { Plus, Edit, Trash2, X, FolderTree } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data } = await categoryService.getCategories();
      setCategories(Array.isArray(data) ? data : (data.content || []));
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditCategory(null);
    setForm({ name: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditCategory(c);
    setForm({ name: c.name || '', description: c.description || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editCategory) {
        await categoryService.update(editCategory.id, form);
      } else {
        await categoryService.create(form);
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await categoryService.delete(id);
      loadCategories();
    } catch {
      alert('Failed to delete category');
    }
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Categories</h2>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Category</button>
      </div>

      {loading ? (
        <div className="card">
          <div className="card-body" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading categories...</div>
        </div>
      ) : categories.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FolderTree size={48} />
            <h3>No Categories</h3>
            <p>Create your first category to get started.</p>
            <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 16 }}><Plus size={16} /> Add Category</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {categories.map((c) => (
            <div key={c.id} className="card" style={{ transition: 'var(--transition)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FolderTree size={20} color="var(--primary)" />
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}><Edit size={14} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{c.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.description || 'No description'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editCategory ? 'Edit Category' : 'Add Category'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" rows={3} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editCategory ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
