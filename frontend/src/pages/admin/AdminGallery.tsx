import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Plus, Trash2, X } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';

interface GalleryImage {
  id: number;
  eventName: string;
  description: string;
  imageBase64: string;
}

export const AdminGallery = () => {
  const { fetchWithAuth } = useAdminAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    imageBase64: '',
  });

  const fetchImages = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/gallery');
      if (res.ok) setImages(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
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
    if (!formData.imageBase64) {
      alert('Please select an image.');
      return;
    }
    
    try {
      const res = await fetchWithAuth('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchImages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      const res = await fetchWithAuth(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) fetchImages();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = () => {
    setFormData({ eventName: '', description: '', imageBase64: '' });
    setIsModalOpen(true);
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Gallery</h1>
          <p className="admin-page-subtitle">Manage photos of your past events.</p>
        </div>
        <button className="btn-admin btn-admin-primary" onClick={openModal}>
          <Plus size={18} /> Add Photo
        </button>
      </div>

      <div className="admin-section">
        <div className="gallery-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {images.map(img => (
            <div key={img.id} className="gallery-item" style={{ position: 'relative' }}>
              <div className="gallery-photo" style={{ height: '200px' }}>
                {img.imageBase64 ? (
                  <img src={img.imageBase64} alt={img.eventName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#eee' }}></div>
                )}
              </div>
              <div className="gallery-cap" style={{ background: '#fff', padding: '12px' }}>
                <div style={{ fontWeight: 500 }}>{img.eventName || 'Untitled'}</div>
                {img.description && <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '4px' }}>{img.description}</div>}
              </div>
              <button 
                onClick={() => handleDelete(img.id)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', color: 'var(--burgundy)', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        {images.length === 0 && (
          <div className="admin-empty">No photos in the gallery.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="admin-modal-header">
              <h2>Add New Photo</h2>
              <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} className="admin-modal-body" style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Photo *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {formData.imageBase64 && (
                    <img src={formData.imageBase64} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', background: '#f5f5f5', borderRadius: '4px' }} />
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Event Name / Title *</label>
                <input type="text" className="admin-input" required value={formData.eventName} onChange={e => setFormData(prev => ({ ...prev, eventName: e.target.value }))} placeholder="e.g., Summer Wedding 2026" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Short Description</label>
                <input type="text" className="admin-input" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Optional detail" />
              </div>

              <div className="admin-modal-footer" style={{ marginTop: '16px', padding: 0 }}>
                <button type="button" className="btn-admin btn-admin-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-admin btn-admin-primary">Upload Photo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
