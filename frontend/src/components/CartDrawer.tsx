import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CartDrawer = () => {
  const { cartItems, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/order');
  };

  return (
    <>
      <div 
        className="cart-overlay" 
        id="cartOverlay" 
        style={{ display: isCartOpen ? 'block' : 'none' }}
        onClick={closeCart}
      ></div>
      <aside 
        className={`cart-drawer ${isCartOpen ? 'open' : ''}`} 
        id="cartDrawer" 
        aria-label="Your order"
      >
        <div className="cart-drawer-header">
          <h3>Your Order</h3>
          <button type="button" className="cart-close" id="cartClose" aria-label="Close cart" onClick={closeCart}>&times;</button>
        </div>
        <div className="cart-items" id="cartItems">
          {cartItems.length === 0 ? (
            <p className="cart-empty" style={{ padding: '20px' }}>
              Your order is empty. Browse the <Link to="/menu" onClick={closeCart} style={{ color: 'var(--burgundy)', textDecoration: 'underline' }}>menu</Link> to add dishes or packages.
            </p>
          ) : (
            cartItems.map((item) => (
              <div className="cart-line" key={item.id}>
                <div className="cl-info">
                  <span className="cl-name">{item.name}</span>
                  <span className="cl-price">R{item.price} {item.isPackage && <span style={{ fontSize: '0.85em' }}>/ guest</span>}</span>
                </div>
                <div className="cl-actions">
                  <div className="qty-stepper" data-context="cart">
                    <button type="button" className="qty-btn" aria-label="Decrease quantity" onClick={() => updateQuantity(item.id, item.qty - 1)}>−</button>
                    <span className="qty-val">{item.qty}</span>
                    <button type="button" className="qty-btn" aria-label="Increase quantity" onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
                  </div>
                  <button type="button" className="cl-remove" aria-label="Remove item" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-subtotal"><span>Subtotal</span><span id="cartSubtotal">R{cartTotal}</span></div>
          <button 
            type="button" 
            className="btn btn-primary" 
            id="cartCheckoutBtn" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Checkout
          </button>
          <p className="field-help" style={{ marginTop: '12px' }}>Final pricing and delivery fees are confirmed when we contact you to arrange payment.</p>
        </div>
      </aside>
    </>
  );
};
