import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type GalleryItemProps = {
  id: string;
  eventName: string;
  description: string;
  imageBase64: string;
};

export const Gallery = () => {
  const [images, setImages] = useState<GalleryItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<GalleryItemProps | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="page" data-page="gallery">
      <div className="page-banner">
        <div className="wrap">
          <span className="eyebrow on-dark">Our Work</span>
          <h1>A taste of distinction.</h1>
          <p>Explore our recent events, from intimate gatherings to grand celebrations.</p>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner"></div>
              <p>Loading gallery...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="admin-empty">
              <p>No photos have been uploaded yet. Check back soon!</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {images.map(img => (
                <div key={img.id} className="gallery-item" style={{ cursor: 'pointer' }} onClick={() => setLightboxImage(img)}>
                  <div className="gallery-photo">
                    {img.imageBase64 ? (
                      <img src={img.imageBase64} alt={img.eventName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--gold-deep)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    )}
                  </div>
                  <div className="gallery-cap">
                    {img.eventName}
                    {img.description && <span className="tag">{img.description}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="admin-modal-overlay" onClick={() => setLightboxImage(null)} style={{ zIndex: 600, padding: 0 }}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', background: 'var(--ink)', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <button 
              className="admin-modal-close" 
              onClick={() => setLightboxImage(null)} 
              style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--cream)', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '6px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} />
            </button>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
              {lightboxImage.imageBase64 ? (
                <img src={lightboxImage.imageBase64} alt={lightboxImage.eventName} style={{ maxWidth: '100%', maxHeight: 'calc(90vh - 80px)', objectFit: 'contain' }} />
              ) : (
                <p style={{ color: 'var(--cream)' }}>No Image</p>
              )}
            </div>
            <div style={{ padding: '16px 20px', background: 'var(--burgundy)', color: 'var(--cream)' }}>
              <h3 style={{ margin: 0, color: 'var(--gold)', fontSize: '1.2rem' }}>{lightboxImage.eventName}</h3>
              {lightboxImage.description && <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#EADFCB' }}>{lightboxImage.description}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
