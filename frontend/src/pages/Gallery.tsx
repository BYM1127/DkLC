import { useState } from 'react';

type GalleryItem = {
  id: number;
  src: string;
  alt: string;
  caption: string;
  tag: string;
  cat: 'mains' | 'platters' | 'desserts' | 'setups';
};

const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, src: '/gallery-oxtail.png',      alt: 'Rich slow-braised oxtail stew in dark bowl',         caption: 'Oxtail Stew',           tag: 'Mains',        cat: 'mains'    },
  { id: 2, src: '/gallery-chicken.png',     alt: 'Golden grilled chicken quarters on wooden board',     caption: 'Grilled Chicken',       tag: 'Mains',        cat: 'mains'    },
  { id: 3, src: '/gallery-morogo.png',      alt: 'Traditional morogo and pap on white plate',           caption: 'Morogo & Pap',          tag: 'Mains',        cat: 'mains'    },
  { id: 4, src: '/gallery-feast.png',       alt: 'Overhead view of full South African feast spread',    caption: 'Full Feast Spread',     tag: 'Platters',     cat: 'platters' },
  { id: 5, src: '/gallery-salads.png',      alt: 'Colorful catering salad and sides table',             caption: 'Salad & Sides Table',   tag: 'Platters',     cat: 'platters' },
  { id: 6, src: '/gallery-malva.png',       alt: 'Warm malva pudding with custard sauce',               caption: 'Malva Pudding',         tag: 'Desserts',     cat: 'desserts' },
  { id: 7, src: '/gallery-koeksisters.png', alt: 'Golden sticky koeksisters on white plate',            caption: 'Koeksisters',           tag: 'Desserts',     cat: 'desserts' },
  { id: 8, src: '/gallery-wedding.png',     alt: 'Elegant outdoor wedding reception catering setup',    caption: 'Wedding Reception',     tag: 'Event Setups', cat: 'setups'   },
  { id: 9, src: '/gallery-buffet.png',      alt: 'Professional catering buffet layout with chafing dishes', caption: 'Buffet Layout',     tag: 'Event Setups', cat: 'setups'   },
];

type Filter = 'all' | 'mains' | 'platters' | 'desserts' | 'setups';

export const Gallery = () => {
  const [active, setActive] = useState<Filter>('all');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = active === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.cat === active);

  return (
    <section className="page" data-page="gallery">

  <div className="page-banner">
    <div className="wrap">
      <span className="eyebrow on-dark">Gallery</span>
      <h1>A taste of what we serve.</h1>
      <p>From intimate family tables to grand wedding feasts — every dish, crafted with love.</p>
    </div>
  </div>

  <section className="section">
    <div className="wrap">
      <div className="filter-row" id="filterRow">
        {(['all', 'mains', 'platters', 'desserts', 'setups'] as Filter[]).map(f => (
          <button
            key={f}
            className={`filter-btn${active === f ? ' active' : ''}`}
            onClick={() => setActive(f)}
          >
            {f === 'all' ? 'All' : f === 'mains' ? 'Mains' : f === 'platters' ? 'Platters & Spreads' : f === 'desserts' ? 'Desserts' : 'Event Setups'}
          </button>
        ))}
      </div>

      <div className="gallery-grid" id="galleryGrid">
        {filtered.map(item => (
          <div
            key={item.id}
            className="gallery-item gallery-item-real"
            onClick={() => setLightbox(item)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setLightbox(item)}
            aria-label={`View ${item.caption}`}
          >
            <div className="gallery-photo gallery-photo-real">
              <img src={item.src} alt={item.alt} loading="lazy" />
            </div>
            <div className="gallery-cap">
              {item.caption}
              <span className="tag">{item.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Lightbox */}
  {lightbox && (
    <div
      className="gallery-lightbox-overlay"
      onClick={() => setLightbox(null)}
      role="dialog"
      aria-modal="true"
      aria-label={lightbox.caption}
    >
      <button className="gallery-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">✕</button>
      <div className="gallery-lightbox-inner" onClick={e => e.stopPropagation()}>
        <img src={lightbox.src} alt={lightbox.alt} />
        <p className="gallery-lightbox-cap">{lightbox.caption} <span className="tag">{lightbox.tag}</span></p>
      </div>
    </div>
  )}

</section>
  );
};
