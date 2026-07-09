import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Save } from 'lucide-react';

export const AdminSettings = () => {
  const { fetchWithAuth } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    aboutText: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    deliveryAreas: '',
    hoursOfOperation: '',
  });

  const fetchSettings = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setFormData({
            aboutText: data.aboutText || '',
            contactPhone: data.contactPhone || '',
            contactEmail: data.contactEmail || '',
            address: data.address || '',
            deliveryAreas: data.deliveryAreas || '',
            hoursOfOperation: data.hoursOfOperation || '',
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchWithAuth]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    
    try {
      const res = await fetchWithAuth('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMsg('Settings saved successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Site Settings</h1>
        <p className="admin-page-subtitle">Manage your website's content and contact information.</p>
      </div>

      <div className="admin-section" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '24px' }}>
          
          <div>
            <h3 style={{ borderBottom: '1px solid var(--cream-line)', paddingBottom: '8px', marginBottom: '16px' }}>About & Story</h3>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 500 }}>About Text (Shown on Home and About pages)</label>
            <textarea 
              className="admin-input" 
              rows={5} 
              value={formData.aboutText} 
              onChange={e => setFormData(prev => ({ ...prev, aboutText: e.target.value }))} 
              placeholder="Tell your story..."
            />
          </div>

          <div>
            <h3 style={{ borderBottom: '1px solid var(--cream-line)', paddingBottom: '8px', marginBottom: '16px' }}>Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 500 }}>Phone / WhatsApp</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={formData.contactPhone} 
                  onChange={e => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 500 }}>Email Address</label>
                <input 
                  type="email" 
                  className="admin-input" 
                  value={formData.contactEmail} 
                  onChange={e => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))} 
                />
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ borderBottom: '1px solid var(--cream-line)', paddingBottom: '8px', marginBottom: '16px' }}>Location & Operations</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 500 }}>Physical Address</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={formData.address} 
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 500 }}>Delivery Areas</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={formData.deliveryAreas} 
                  onChange={e => setFormData(prev => ({ ...prev, deliveryAreas: e.target.value }))} 
                  placeholder="e.g., Limpopo, Gauteng"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 500 }}>Hours of Operation</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={formData.hoursOfOperation} 
                  onChange={e => setFormData(prev => ({ ...prev, hoursOfOperation: e.target.value }))} 
                  placeholder="e.g., Mon-Sat: 08:00 - 17:00"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            <button type="submit" className="btn-admin btn-admin-primary" disabled={saving}>
              <Save size={18} style={{ marginRight: '8px' }} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {successMsg && <span style={{ color: '#25D366', fontWeight: 500 }}>{successMsg}</span>}
          </div>

        </form>
      </div>
    </div>
  );
};
