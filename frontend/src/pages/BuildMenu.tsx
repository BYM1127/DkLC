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

const PRESET_MENUS = [
  {
    name: "The Royal African Feast",
    description: "A lavish spread of traditional favorites designed for weddings and grand celebrations.",
    items: ["Traditional Beef Stew", "Creamy Spinach", "Chakalaka", "Dombolo (Dumplings)", "Roasted Butternut", "Malva Pudding"],
  },
  {
    name: "Intimate Wedding Set",
    description: "An elegant, curated 3-course menu perfect for smaller, refined gatherings.",
    items: ["Smoked Salmon Blinis", "Herb-Crusted Rack of Lamb", "Garlic Mash", "Seasonal Green Beans", "Mini Pavlovas"],
  },
  {
    name: "Corporate Lunch Spread",
    description: "Light, energizing, and professional catering for seminars and corporate events.",
    items: ["Gourmet Sandwiches Platter", "Grilled Chicken Skewers", "Quinoa Salad", "Fresh Fruit Platter"],
  },
  {
    name: "Classic Heritage Menu",
    description: "The comforting, authentic taste of home. Perfect for family reunions or memorials.",
    items: ["Hard Body Chicken", "Pap", "Morogo", "Beetroot Salad", "Ginger Beer"],
  },
  {
    name: "The Grand Buffet",
    description: "A sprawling selection to satisfy every palate, offering a mix of modern and traditional.",
    items: ["Beef Curry", "Lemon Herb Fish", "Savoury Rice", "Creamy Potato Salad", "Greek Salad", "Trifle"],
  }
];

export const BuildMenu = () => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [menuItems, setMenuItems] = useState<MenuItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Selection State
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customSelection, setCustomSelection] = useState<string[]>([]);
  
  const navigate = useNavigate();

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
  }, [activeTab]);

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
            <div className="grid-2">
              {PRESET_MENUS.map((preset, idx) => (
                <div 
                  key={idx} 
                  className="card" 
                  style={{ 
                    cursor: 'pointer', 
                    border: selectedPreset === preset.name ? '2px solid var(--burgundy)' : '1px solid var(--border-subtle)',
                    transform: selectedPreset === preset.name ? 'translateY(-4px)' : 'none',
                    boxShadow: selectedPreset === preset.name ? 'var(--shadow-lg)' : 'none'
                  }}
                  onClick={() => {
                    setSelectedPreset(preset.name);
                    setCustomSelection([]);
                  }}
                >
                  <h3 style={{ fontSize: '1.6rem', color: selectedPreset === preset.name ? 'var(--burgundy)' : 'var(--text-main)' }}>{preset.name}</h3>
                  <p style={{ margin: '12px 0 24px', fontSize: '1rem' }}>{preset.description}</p>
                  <ul style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
                    {preset.items.map((item, i) => (
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
              ))}
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
                        {item.imageBase64 && (
                          <div className="dish-photo">
                            <img src={item.imageBase64} alt={item.name} />
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
