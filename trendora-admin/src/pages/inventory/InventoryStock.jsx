import { useState, useEffect } from 'react';
import { Search, Package, AlertTriangle, TrendingDown, TrendingUp, Plus, Minus, Edit2 } from 'lucide-react';
import { productService } from '../../services/adminService';

export default function InventoryStock() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getProducts({ limit: 200 });
        setProducts(res.data?.content || res.data || []);
      } catch {}
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => (p.name || '').toLowerCase().includes(q));
    }
    if (stockFilter === 'out') {
      result = result.filter(p => (p.stock ?? p.stockQuantity ?? 0) === 0);
    } else if (stockFilter === 'low') {
      result = result.filter(p => {
        const s = p.stock ?? p.stockQuantity ?? 0;
        return s > 0 && s <= 10;
      });
    } else if (stockFilter === 'ok') {
      result = result.filter(p => (p.stock ?? p.stockQuantity ?? 0) > 10);
    }
    setFiltered(result);
  }, [search, stockFilter, products]);

  const getStockLevel = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', pct: 0 };
    if (stock <= 5) return { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', pct: (stock / 50) * 100 };
    if (stock <= 10) return { label: 'Low', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', pct: (stock / 50) * 100 };
    if (stock <= 25) return { label: 'Moderate', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', pct: (stock / 50) * 100 };
    return { label: 'In Stock', color: '#10b981', bg: 'rgba(16,185,129,0.1)', pct: Math.min((stock / 50) * 100, 100) };
  };

  const handleStockUpdate = async (productId, newStock) => {
    try {
      await productService.update(productId, { stock: parseInt(newStock) });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: parseInt(newStock) } : p));
      setEditing(null);
    } catch {}
  };

  const adjustStock = async (productId, currentStock, delta) => {
    const newStock = Math.max(0, (currentStock || 0) + delta);
    try {
      await productService.update(productId, { stock: newStock });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
    } catch {}
  };

  const outOfStock = products.filter(p => (p.stock ?? p.stockQuantity ?? 0) === 0).length;
  const lowStock = products.filter(p => {
    const s = p.stock ?? p.stockQuantity ?? 0;
    return s > 0 && s <= 10;
  }).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Stock Management</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Monitor and adjust product inventory levels</p>
      </div>

      {/* Alert cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          borderRadius: 12,
          padding: '18px 20px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{outOfStock}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Out of Stock</div>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          borderRadius: 12,
          padding: '18px 20px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingDown size={22} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{lowStock}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Low Stock</div>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: 12,
          padding: '18px 20px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{products.length - outOfStock - lowStock}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Well Stocked</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          padding: '10px 14px',
        }}>
          <Search size={16} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: 13, flex: 1, background: 'transparent' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'out', label: 'Out of Stock' },
            { id: 'low', label: 'Low Stock' },
            { id: 'ok', label: 'In Stock' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStockFilter(f.id)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                background: stockFilter === f.id ? '#059669' : '#f3f4f6',
                color: stockFilter === f.id ? '#fff' : '#6b7280',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            background: '#fff',
            borderRadius: 12,
            padding: 60,
            textAlign: 'center',
            border: '1px solid #e5e7eb',
          }}>
            <Package size={40} color="#d1d5db" style={{ marginBottom: 12 }} />
            <div style={{ color: '#9ca3af', fontSize: 14 }}>No products found</div>
          </div>
        ) : (
          filtered.map(product => {
            const stock = product.stock || product.stockQuantity || 0;
            const level = getStockLevel(stock);
            return (
              <div key={product.id} style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
              }}>
                {/* Color bar based on stock level */}
                <div style={{ height: 4, background: level.color }} />

                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                        {product.price?.toLocaleString() || '0'} XAF
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                      background: level.bg, color: level.color,
                    }}>
                      {level.label}
                    </span>
                  </div>

                  {/* Stock bar */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{
                      height: 8,
                      borderRadius: 4,
                      background: '#f3f4f6',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${level.pct}%`,
                        borderRadius: 4,
                        background: level.color,
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>0</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: level.color }}>{stock} units</span>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>50</span>
                    </div>
                  </div>

                  {/* Stock controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => adjustStock(product.id, stock, -1)}
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        border: '1px solid #e5e7eb', background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Minus size={14} color="#6b7280" />
                    </button>

                    {editing === product.id ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleStockUpdate(product.id, editValue)}
                        onKeyDown={(e) => e.key === 'Enter' && handleStockUpdate(product.id, editValue)}
                        autoFocus
                        style={{
                          width: 60, textAlign: 'center', padding: '4px 0',
                          border: '1px solid #059669', borderRadius: 6,
                          fontSize: 13, fontWeight: 700, outline: 'none',
                        }}
                      />
                    ) : (
                      <div
                        onClick={() => { setEditing(product.id); setEditValue(String(stock)); }}
                        style={{
                          width: 60, textAlign: 'center', padding: '4px 0',
                          border: '1px solid #e5e7eb', borderRadius: 6,
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          color: '#111827',
                        }}
                      >
                        {stock}
                      </div>
                    )}

                    <button
                      onClick={() => adjustStock(product.id, stock, 1)}
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        border: '1px solid #e5e7eb', background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={14} color="#6b7280" />
                    </button>

                    <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4 }}>units</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
