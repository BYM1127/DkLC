import { useState } from 'react';
import { useCart } from '../context/CartContext';

type MenuItemProps = {
  id: string;
  name: string;
  price: number;
  desc: string;
  chips?: React.ReactNode;
  min?: number;
  max?: number;
  isPackage?: boolean;
};

const MenuItemRow = ({ id, name, price, desc, chips, min = 1, max = 20 }: MenuItemProps) => {
  const [qty, setQty] = useState(min);
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({ id, name, price }, qty);
    setQty(min);
  };

  return (
    <div className="menu-item-wrap">
      <div className="menu-item">
        <span className="menu-item-name">{name} {chips}</span>
        <span className="menu-item-fill"></span>
        <span className="menu-item-price">R{price}</span>
      </div>
      <span className="menu-item-desc">{desc}</span>
      <div className="item-order-row">
        <div className="qty-stepper">
          <button type="button" className="qty-btn" aria-label="Decrease quantity" onClick={() => setQty(q => Math.max(min, q - 1))}>−</button>
          <span className="qty-val">{qty}</span>
          <button type="button" className="qty-btn" aria-label="Increase quantity" onClick={() => setQty(q => Math.min(max, q + 1))}>+</button>
        </div>
        <button type="button" className="btn-add" onClick={handleAdd}>Add to Order</button>
      </div>
    </div>
  );
};

type PackageCardProps = {
  id: string;
  name: string;
  price: number;
  eyebrow: string;
  title: string;
  items: string[];
  featured?: boolean;
};

const PackageCard = ({ id, name, price, eyebrow, title, items, featured = false }: PackageCardProps) => {
  const [qty, setQty] = useState(20);
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({ id, name, price, isPackage: true }, qty);
    setQty(20);
  };

  return (
    <div className={`package-card ${featured ? 'featured' : ''}`}>
      <span className="eyebrow on-dark">{eyebrow}</span>
      <h3 style={{ color: 'var(--cream)', marginTop: '8px' }}>{title}</h3>
      <div className="price">R{price}<span style={{ fontSize: '0.95rem', color: '#EADFCB', fontFamily: 'var(--body)' }}> / guest</span></div>
      <ul>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <div className="item-order-row" style={{ marginTop: 'auto', paddingTop: '14px' }}>
        <div className="qty-stepper">
          <button type="button" className="qty-btn" aria-label="Decrease guests" onClick={() => setQty(q => Math.max(10, q - 1))}>−</button>
          <span className="qty-val">{qty}</span>
          <button type="button" className="qty-btn" aria-label="Increase guests" onClick={() => setQty(q => Math.min(500, q + 1))}>+</button>
        </div>
        <span className="qty-guests-label">guests</span>
      </div>
      <button type="button" className="btn-add" onClick={handleAdd} style={{ marginTop: '10px', justifyContent: 'center' }}>
        Add Package to Order
      </button>
    </div>
  );
};

export const Menu = () => {
  return (
    <section className="page" data-page="menu">

  <div className="page-banner">
    <div className="wrap">
      <span className="eyebrow on-dark">Our Menu</span>
      <h1>Choose your feast.</h1>
      <p>Browse the menu and add dishes straight to your order, or choose a per-head package below — every menu may be tailored to your guest count, budget and dietary needs.</p>
    </div>
  </div>

  <section className="section">
    <div className="wrap">

      <div className="menu-cat">
        <h3 className="menu-cat-title">Mains & Meats</h3>
        <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
        <MenuItemRow id="oxtail-stew" name="Oxtail Stew" price={95} desc="Slow-braised oxtail in rich tomato-onion gravy." />
        <MenuItemRow id="beef-stew-dumplings" name="Beef Stew & Dumplings" price={75} desc="Tender beef chunks with soft steamed dumplings." />
        <MenuItemRow id="grilled-chicken-quarters" name="Grilled Chicken Quarters" price={65} desc="Marinated overnight, grilled to order." chips={<span className="chip gold" style={{ marginLeft: '4px' }}>Halal-friendly</span>} />
        <MenuItemRow id="mogodu-tripe" name="Mogodu (Tripe)" price={70} desc="Slow-cooked tripe, a true comfort classic." />
        <MenuItemRow id="curried-chicken" name="Curried Chicken" price={65} desc="Mildly spiced, simmered until tender." chips={<span className="chip spice" style={{ marginLeft: '4px' }}>Spicy</span>} />
      </div>

      <div className="menu-cat">
        <h3 className="menu-cat-title">Pap, Rice & Sides</h3>
        <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
        <MenuItemRow id="stywe-pap" name="Stywe Pap" price={20} desc="Firm maize porridge, the everyday staple." />
        <MenuItemRow id="samp-beans" name="Samp & Beans" price={30} desc="Slow-cooked samp with sugar beans." chips={<span className="chip gold" style={{ marginLeft: '4px' }}>Vegetarian</span>} />
        <MenuItemRow id="morogo-wild-spinach" name="Morogo (Wild Spinach)" price={25} desc="Cooked with onion and tomato." chips={<span className="chip gold" style={{ marginLeft: '4px' }}>Vegetarian</span>} />
        <MenuItemRow id="butternut" name="Butternut" price={25} desc="Roasted and lightly sweetened." chips={<span className="chip gold" style={{ marginLeft: '4px' }}>Vegetarian</span>} />
        <MenuItemRow id="yellow-rice" name="Yellow Rice" price={25} desc="Fragrant rice with turmeric and raisins." chips={<span className="chip gold" style={{ marginLeft: '4px' }}>Vegetarian</span>} />
      </div>

      <div className="menu-cat">
        <h3 className="menu-cat-title">Salads</h3>
        <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
        <MenuItemRow id="coleslaw" name="Coleslaw" price={20} desc="Crisp cabbage and carrot in a creamy dressing." />
        <MenuItemRow id="beetroot-salad" name="Beetroot Salad" price={20} desc="Sweet-tangy, served chilled." />
        <MenuItemRow id="three-bean-salad" name="Three-Bean Salad" price={20} desc="A light, tangy mix of beans." chips={<span className="chip gold" style={{ marginLeft: '4px' }}>Vegan</span>} />
      </div>

      <div className="menu-cat">
        <h3 className="menu-cat-title">Desserts</h3>
        <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
        <MenuItemRow id="malva-pudding" name="Malva Pudding" price={35} desc="Warm syrup sponge with custard." />
        <MenuItemRow id="milk-tart" name="Milk Tart" price={30} desc="Creamy custard tart with cinnamon." />
        <MenuItemRow id="koeksisters" name="Koeksisters" price={15} desc="Plaited, syrup-soaked and crisp." />
      </div>

      <div className="menu-cat">
        <h3 className="menu-cat-title">Beverages</h3>
        <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
        <MenuItemRow id="homemade-ginger-beer" name="Homemade Ginger Beer" price={20} desc="Brewed fresh, served chilled." />
        <MenuItemRow id="rooibos-iced-tea" name="Rooibos Iced Tea" price={18} desc="Lightly sweetened, naturally caffeine-free." />
        <MenuItemRow id="soft-drinks-juice" name="Soft Drinks & Juice" price={15} desc="A selection of cold drinks." />
      </div>

    </div>
  </section>

  <section className="section" style={{ background: 'var(--cream-deep)', borderTop: '1px solid var(--cream-line)' }}>
    <div className="wrap" style={{ textAlign: 'center' }}>
      <span className="eyebrow">Per-Head Packages</span>
      <h2>Or let us compose a full spread</h2>
      <p style={{ marginBottom: '10px' }}>Starting prices below — final pricing depends on guest count, menu and location.</p>
      <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
      <div className="grid-3" style={{ textAlign: 'left' }}>
        <PackageCard 
          id="bronze-feast" 
          name="Bronze Feast (Everyday Gathering)" 
          price={120} 
          eyebrow="Bronze Feast" 
          title="Everyday Gathering" 
          items={['2 mains of your choice', '2 sides + pap or rice', '1 salad']} 
        />
        <PackageCard 
          id="silver-feast" 
          name="Silver Feast (Most Popular)" 
          price={165} 
          eyebrow="Silver Feast" 
          title="Most Popular" 
          featured={true}
          items={['3 mains of your choice', '3 sides + pap or rice', '2 salads + 1 dessert']} 
        />
        <PackageCard 
          id="gold-feast" 
          name="Gold Feast (Full Celebration)" 
          price={220} 
          eyebrow="Gold Feast" 
          title="Full Celebration" 
          items={['4 mains of your choice', '4 sides + pap or rice', '2 salads + 2 desserts + drinks']} 
        />
      </div>
    </div>
  </section>

</section>
  );
};
