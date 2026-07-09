import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageBase64: string;
  isActive: boolean;
}

export const AdminMenu = () => {
  const { fetchWithAuth } = useAdminAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageBase64: '',
    isActive: true,
  });

  const fetchItems = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/menu');
      if (res.ok) setItems(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchWithAuth]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setFormData(prev => ({ ...prev, imageBase64: compressedBase64 }));
      } catch (err) {
        console.error('Failed to compress image:', err);
        alert('Failed to process image. Please try another one.');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/admin/menu/${editingItem.id}` : '/api/admin/menu';
      const method = editingItem ? 'PUT' : 'POST';
      
      const res = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetchWithAuth(`/api/admin/menu/${id}`, { method: 'DELETE' });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        imageBase64: item.imageBase64,
        isActive: item.isActive,
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', price: 0, category: '', imageBase64: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Menu Items</h1>
          <p className="admin-page-subtitle">Manage products visible to customers.</p>
        </div>
        <button className="btn-admin btn-admin-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add New Item
        </button>
      </div>

      <div className="admin-section">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name & Desc</th>
                <th>Price</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.imageBase64 ? (
                      <img src={item.imageBase64} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', background: 'var(--cream-line)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        No Img
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</div>
                  </td>
                  <td>R{item.price}</td>
                  <td>{item.category || 'N/A'}</td>
                  <td>
                    <span className={`admin-status ${item.isActive ? 'status-confirmed' : 'status-cancelled'}`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-admin-icon" onClick={() => openModal(item)}><Edit2 size={16} /></button>
                      <button className="btn-admin-icon" style={{ color: 'var(--burgundy)' }} onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>No menu items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="admin-modal-header">
              <h2>{editingItem ? 'Edit Item' : 'New Menu Item'}</h2>
              <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} className="admin-modal-body" style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Item Name *</label>
                <input type="text" className="admin-input" required value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Description</label>
                <textarea className="admin-input" rows={3} value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Price (R) *</label>
                  <input type="number" className="admin-input" required min="0" step="0.01" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Category</label>
                  <input type="text" className="admin-input" placeholder="e.g. Mains, Sides..." value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {formData.imageBase64 && (
                    <img src={formData.imageBase64} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} />
                  Active (Visible on website)
                </label>
              </div>

              <div className="admin-modal-footer" style={{ marginTop: '16px', padding: 0 }}>
                <button type="button" className="btn-admin btn-admin-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-admin btn-admin-primary">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
