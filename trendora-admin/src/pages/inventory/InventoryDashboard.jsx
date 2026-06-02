import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService, categoryService } from '../../services/adminService';

export default function InventoryDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.allSettled([
          productService.getProducts({ limit: 100 }),
          categoryService.getCategories(),
        ]);
        const prods = prodRes.status === 'fulfilled' ? (prodRes.value.data?.content || prodRes.value.data || []) : [];
        const cats = catRes.status === 'fulfilled' ? (catRes.value.data || []) : [];
        setProducts(prods);
        setCategories(cats);
        setLowStock(prods.filter(p => {
          const s = p.stock ?? p.stockQuantity ?? 0;
          return s > 0 && s <= 10;
        }));
        setOutOfStock(prods.filter(p => (p.stock ?? p.stockQuantity ?? 0) === 0));
      } catch {}
    };
    fetchData();
  }, []);

  const getStockLevel = (stock) => {
    if (stock === 0) return { color: '#ef4444', pct: 0, label: 'Out' };
    if (stock <= 5) return { color: '#ef4444', pct: (stock / 50) * 100, label: 'Critical' };
    if (stock <= 10) return { color: '#f59e0b', pct: (stock / 50) * 100, label: 'Low' };
    if (stock <= 25) return { color: '#3b82f6', pct: (stock / 50) * 100, label: 'OK' };
    return { color: '#10b981', pct: Math.min((stock / 50) * 100, 100), label: 'Good' };
  };

  return (
    <div>
      {/* Top: 3 alert cards with gradient backgrounds */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
          borderRadius: 14, padding: '20px 24px', color: '#fff',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={26} />
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{outOfStock.length}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Out of Stock</div>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #b45309)',
          borderRadius: 14, padding: '20px 24px', color: '#fff',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingDown size={26} />
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{lowStock.length}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Low Stock</div>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #047857)',
          borderRadius: 14, padding: '20px 24px', color: '#fff',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={26} />
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{products.length - outOfStock.length - lowStock.length}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Well Stocked</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Left: Product grid with stock bars */}
        <div style={{
          background: '#fff', borderRadius: 12,
          border: '1px solid #e5e7eb', overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid #f3f4f6',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package size={16} color="#84cc16" />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Product Stock Levels</h3>
            </div>
            <button
              onClick={() => navigate('/inventory/stock')}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 12, color: '#84cc16', fontWeight: 600,
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              Manage Stock <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ padding: 16 }}>
            {products.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No products</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {products.slice(0, 8).map(product => {
                  const stock = product.stock || product.stockQuantity || 0;
                  const level = getStockLevel(stock);
                  return (
                    <div key={product.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                      borderBottom: '1px solid #f9fafb',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{product.price?.toLocaleString() || '0'} XAF</div>
                      </div>
                      {/* Stock bar */}
                      <div style={{ width: 120 }}>
                        <div style={{ height: 6, borderRadius: 3, background: '#f3f4f6', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${level.pct}%`, borderRadius: 3,
                            background: level.color, transition: 'width 0.3s',
                          }} />
                        </div>
                      </div>
                      <div style={{ width: 50, textAlign: 'right' }}>
                        <span style={{
                          fontSize: 12, fontWeight: 700, color: level.color,
                        }}>
                          {stock}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                        background: `${level.color}15`, color: level.color,
                        width: 50, textAlign: 'center',
                      }}>
                        {level.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Category breakdown */}
        <div style={{
          background: '#fff', borderRadius: 12,
          border: '1px solid #e5e7eb', overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid #f3f4f6',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Categories</h3>
          </div>
          <div style={{ padding: 16 }}>
            {categories.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 12 }}>No categories</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {categories.map(cat => {
                  const catProducts = products.filter(p => p.category === cat.name || p.categoryId === cat.id);
                  return (
                    <div key={cat.id} style={{
                      padding: '10px 12px', borderRadius: 8,
                      border: '1px solid #f3f4f6',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{cat.name}</span>
                      <span style={{
                        fontSize: 12, fontWeight: 700, color: '#84cc16',
                        background: 'rgba(132,204,22,0.1)',
                        padding: '2px 8px', borderRadius: 6,
                      }}>
                        {catProducts.length}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick action */}
          <div style={{ padding: '0 16px 16px' }}>
            <button
              onClick={() => navigate('/inventory/products')}
              style={{
                width: '100%', padding: '10px 0', borderRadius: 10,
                border: '1px solid #e5e7eb', background: '#fff',
                fontSize: 13, fontWeight: 600, color: '#84cc16',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Package size={14} /> View All Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
