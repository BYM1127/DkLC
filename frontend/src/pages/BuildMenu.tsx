import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type MenuItemProps = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageBase64: string;
};

type PresetMenuProps = {
  id: number;
  name: string;
  description: string;
  items: string; // JSON string
  imageBase64: string;
};

export const BuildMenu = () => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [menuItems, setMenuItems] = useState<MenuItemProps[]>([]);
  const [presetMenus, setPresetMenus] = useState<PresetMenuProps[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection State
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customSelection, setCustomSelection] = useState<string[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch preset menus on mount
    fetch('/api/preset-menus')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPresetMenus(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeTab === 'custom' && menuItems.length === 0) {
      setLoading(true);
      fetch('/api/menu')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setMenuItems(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [activeTab, menuItems.length]);

  const toggleCustomItem = (itemName: string) => {
    setCustomSelection(prev => 
      prev.includes(itemName) ? prev.filter(i => i !== itemName) : [...prev, itemName]
    );
    setSelectedPreset(null); // Clear preset if they start building custom
  };

  const handleProceed = () => {
    let menuString = '';
    if (selectedPreset) {
      menuString = `Preset Menu: ${selectedPreset}`;
    } else if (customSelection.length > 0) {
      menuString = `Custom Menu Selection: ${customSelection.join(', ')}`;
    }
    
    navigate('/quote', { state: { selectedMenu: menuString } });
  };

  const hasSelection = selectedPreset !== null || customSelection.length > 0;

  return (
    <section className="page" data-page="build-menu">
      <div className="page-banner">
        <div className="wrap">
          <span className="eyebrow">Design Your Experience</span>
          <h1>Curate Your Menu</h1>
          <p>Select from our expertly crafted set menus, or hand-pick your favorite dishes to build a custom feast.</p>
        </div>
      </div>

      <section className="section bg-alt" style={{ minHeight: '60vh', paddingBottom: '140px' }}>
        <div className="wrap">
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
            <button 
              className={`btn ${activeTab === 'preset' ? 'btn-primary' : 'btn-outline'}`} 
              style={{ borderColor: activeTab === 'preset' ? 'var(--burgundy)' : 'var(--text-main)', color: activeTab === 'preset' ? 'white' : 'var(--text-main)' }}
              onClick={() => setActiveTab('preset')}
            >
              Pre-Set Menus
            </button>
            <button 
              className={`btn ${activeTab === 'custom' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderColor: activeTab === 'custom' ? 'var(--burgundy)' : 'var(--text-main)', color: activeTab === 'custom' ? 'white' : 'var(--text-main)' }}
              onClick={() => setActiveTab('custom')}
            >
              Build Your Own
            </button>
          </div>

          {activeTab === 'preset' && (
            <div>
              {loading ? (
                <div className="admin-loading"><div className="admin-spinner"></div></div>
              ) : (
                <div className="grid-2">
                  {presetMenus.map((preset) => {
                    let parsedItems: string[] = [];
                    try {
                      parsedItems = JSON.parse(preset.items || '[]');
                    } catch (e) {
                      parsedItems = typeof preset.items === 'string' ? [preset.items] : [];
                    }

                    return (
                      <div 
                        key={preset.id} 
                        className="card dish-card" 
                        style={{ 
                          cursor: 'pointer', 
                          border: selectedPreset === preset.name ? '2px solid var(--burgundy)' : '1px solid var(--border-subtle)',
                          transform: selectedPreset === preset.name ? 'translateY(-4px)' : 'none',
                          boxShadow: selectedPreset === preset.name ? 'var(--shadow-lg)' : 'none',
                          padding: 0,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                        onClick={() => {
                          setSelectedPreset(preset.name);
                          setCustomSelection([]);
                        }}
                      >
                        {preset.imageBase64 && (
                          <div className="dish-photo dish-photo-real" style={{ height: '200px' }}>
                            <img src={preset.imageBase64} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                        <div className="dish-body" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h3 style={{ fontSize: '1.6rem', color: selectedPreset === preset.name ? 'var(--burgundy)' : 'var(--text-main)' }}>{preset.name}</h3>
                          <p style={{ margin: '12px 0 24px', fontSize: '1rem' }}>{preset.description}</p>
                          <ul style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', flex: 1 }}>
                            {parsedItems.map((item, i) => (
                              <li key={i} style={{ display: 'flex', gap: '8px' }}>
                                <span style={{ color: 'var(--gold)' }}>•</span> {item}
                              </li>
                            ))}
                          </ul>
                          {selectedPreset === preset.name && (
                            <div style={{ marginTop: '24px', color: 'var(--burgundy)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                              ✓ Selected
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'custom' && (
            <div>
              {loading ? (
                <div className="admin-loading"><div className="admin-spinner"></div></div>
              ) : (
                <div className="grid-3">
                  {menuItems.map(item => {
                    const isSelected = customSelection.includes(item.name);
                    return (
                      <div 
                        key={item.id} 
                        className="dish-card" 
                        style={{ 
                          cursor: 'pointer',
                          border: isSelected ? '2px solid var(--burgundy)' : '1px solid var(--border-subtle)',
                          transform: isSelected ? 'translateY(-4px)' : 'none',
                        }}
                        onClick={() => toggleCustomItem(item.name)}
                      >
                        {item.imageBase64 ? (
                          <div className="dish-photo dish-photo-real">
                            <img src={item.imageBase64} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ) : (
                          <div className="dish-photo">
                            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--gold-deep)" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                          </div>
                        )}
                        <div className="dish-body">
                          <h3>{item.name}</h3>
                          <span className="dish-price">R{item.price}</span>
                          <p className="dish-desc">{item.description}</p>
                          <div style={{ marginTop: '16px', fontWeight: '600', color: isSelected ? 'var(--burgundy)' : 'var(--text-muted)' }}>
                            {isSelected ? '✓ Added to Menu' : '+ Add to Menu'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* Floating Action Bar */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, 
        background: 'white', borderTop: '1px solid var(--border-subtle)',
        padding: '20px 24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transform: hasSelection ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease', zIndex: 100
      }}>
        <div>
          <span style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Your Selection</span>
          <strong style={{ fontSize: '1.2rem', fontFamily: 'var(--display)' }}>
            {selectedPreset ? selectedPreset : `${customSelection.length} Items Selected`}
          </strong>
        </div>
        <button className="btn btn-primary" onClick={handleProceed}>
          Proceed to Quote
        </button>
      </div>

    </section>
  );
};
