import { useState, useEffect } from 'react';
import { Shield, Save, Users, Bell, MapPin, RotateCcw } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useSettingsStore from '../stores/settingsStore';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const shippingRates = useSettingsStore(s => s.shippingRates);
  const freeShippingThreshold = useSettingsStore(s => s.freeShippingThreshold);
  const updateRates = useSettingsStore(s => s.updateRates);
  const updateThreshold = useSettingsStore(s => s.updateThreshold);
  const resetToDefaults = useSettingsStore(s => s.resetToDefaults);
  const syncFromApi = useSettingsStore(s => s.syncFromApi);
  const saveToApi = useSettingsStore(s => s.saveToApi);
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    currency: 'XAF',
    maintenanceMode: false,
    emailNotifications: true,
    lowStockThreshold: 10,
    autoConfirmOrders: false,
  });

  useEffect(() => {
    const load = async () => {
      await syncFromApi();
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings({
            storeName: data.storeName || data.store_name || '',
            storeEmail: data.storeEmail || data.store_email || '',
            storePhone: data.storePhone || data.store_phone || '',
            currency: data.currency || 'XAF',
            maintenanceMode: data.maintenanceMode === true || data.maintenance_mode === true,
            emailNotifications: data.emailNotifications !== false,
            lowStockThreshold: parseInt(data.lowStockThreshold || data.low_stock_threshold) || 10,
            autoConfirmOrders: data.autoConfirmOrders === true || data.auto_confirm_orders === true,
          });
        }
      } catch {}
    };
    load();
  }, []);

  const handleRateChange = (index, value) => {
    const num = parseInt(value) || 0;
    const updated = [...shippingRates];
    updated[index] = { ...updated[index], fee: num };
    updateRates(updated);
  };

  const handleResetRates = () => {
    resetToDefaults();
  };

  const handleSave = async () => {
    await saveToApi();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const role = (user?.role || '').replace('ROLE_', '');
  if (role !== 'ADMIN') {
    return (
      <div className="page-content">
        <div className="card">
          <div className="empty-state">
            <Shield size={48} />
            <h3>Access Denied</h3>
            <p>Only administrators can access settings.</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'general', label: 'General', icon: Shield },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'delivery', label: 'Delivery', icon: MapPin },
  ];

  const bueaRate = shippingRates.find(r => r.region === 'South-West (Buea)')?.fee || 0;
  const swOtherRate = shippingRates.find(r => r.region === 'South-West (Other)')?.fee || 0;
  const minRate = Math.min(...shippingRates.map(r => r.fee).filter(f => f > 0));
  const maxRate = Math.max(...shippingRates.map(r => r.fee));

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Settings</h2>
        <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        <div className="card" style={{ height: 'fit-content' }}>
          <div style={{ padding: 8 }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`sidebar-link${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                style={{ width: '100%', justifyContent: 'flex-start', color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-secondary)' }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {activeTab === 'general' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Store Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Store Name</label>
                    <input className="form-input" value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <input className="form-input" value="XAF (CFA Franc)" disabled style={{ background: 'var(--border-light)' }} />
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Cameroon CFA Franc — only currency supported</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Support Email</label>
                    <input className="form-input" type="email" value={settings.storeEmail} onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Support Phone</label>
                    <input className="form-input" value={settings.storePhone} onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })} />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', marginTop: 20, paddingTop: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Operations</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>Maintenance Mode</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Temporarily disable the storefront</div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 26 }}>
                      <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} style={{ display: 'none' }} />
                      <span style={{ position: 'absolute', inset: 0, background: settings.maintenanceMode ? 'var(--primary)' : 'var(--border)', borderRadius: 13, cursor: 'pointer', transition: 'var(--transition)' }} />
                      <span style={{ position: 'absolute', top: 3, left: settings.maintenanceMode ? 25 : 3, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: 'var(--transition)', boxShadow: 'var(--shadow-sm)' }} />
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>Auto-Confirm Orders</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Automatically confirm new orders</div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 26 }}>
                      <input type="checkbox" checked={settings.autoConfirmOrders} onChange={(e) => setSettings({ ...settings, autoConfirmOrders: e.target.checked })} style={{ display: 'none' }} />
                      <span style={{ position: 'absolute', inset: 0, background: settings.autoConfirmOrders ? 'var(--primary)' : 'var(--border)', borderRadius: 13, cursor: 'pointer', transition: 'var(--transition)' }} />
                      <span style={{ position: 'absolute', top: 3, left: settings.autoConfirmOrders ? 25 : 3, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: 'var(--transition)', boxShadow: 'var(--shadow-sm)' }} />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Notification Preferences</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>Email Notifications</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Receive email alerts for new orders</div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 26 }}>
                    <input type="checkbox" checked={settings.emailNotifications} onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })} style={{ display: 'none' }} />
                    <span style={{ position: 'absolute', inset: 0, background: settings.emailNotifications ? 'var(--primary)' : 'var(--border)', borderRadius: 13, cursor: 'pointer', transition: 'var(--transition)' }} />
                    <span style={{ position: 'absolute', top: 3, left: settings.emailNotifications ? 25 : 3, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: 'var(--transition)', boxShadow: 'var(--shadow-sm)' }} />
                  </label>
                </div>
                <div className="form-group" style={{ marginTop: 20 }}>
                  <label className="form-label">Low Stock Threshold</label>
                  <input className="form-input" type="number" value={settings.lowStockThreshold} onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 0 })} style={{ width: 200 }} />
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Alert when stock falls below this number</p>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>Shipping Rates by Region</h3>
                  <button className="btn btn-outline" onClick={handleResetRates} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <RotateCcw size={14} /> Reset to Default
                  </button>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                  Customer selects their region → city → pickup point during checkout. Edit rates below to run promos or adjust pricing.
                </p>

                <div className="form-group" style={{ marginBottom: 24 }}>
                  <label className="form-label">Free Shipping Threshold (XAF)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => updateThreshold(parseInt(e.target.value) || 0)}
                    style={{ width: 200 }}
                  />
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Orders above this amount ship free. Set to 0 to disable.</p>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Live Summary</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div style={{ background: 'var(--success-bg)', padding: 16, borderRadius: 10, textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>{bueaRate.toLocaleString()} XAF</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Within Buea City</div>
                    </div>
                    <div style={{ background: 'var(--info-bg)', padding: 16, borderRadius: 10, textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--info)' }}>{swOtherRate.toLocaleString()} XAF</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Outside Buea (South-West)</div>
                    </div>
                    <div style={{ background: 'var(--warning-bg)', padding: 16, borderRadius: 10, textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--warning)' }}>{minRate.toLocaleString()}–{maxRate.toLocaleString()} XAF</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Other Regions Range</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Edit Rates</h4>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr><th style={{ width: '50%' }}>Region</th><th>Shipping Fee (XAF)</th></tr>
                    </thead>
                    <tbody>
                      {shippingRates.map((rate, i) => (
                        <tr key={rate.region}>
                          <td style={{ fontWeight: 500 }}>{rate.region}</td>
                          <td>
                            <input
                              className="form-input"
                              type="number"
                              value={rate.fee}
                              onChange={(e) => handleRateChange(i, e.target.value)}
                              style={{ width: 150, textAlign: 'right', fontWeight: 600 }}
                              min={0}
                              step={100}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {freeShippingThreshold > 0 && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
                      Free shipping on orders above {freeShippingThreshold.toLocaleString()} XAF
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
