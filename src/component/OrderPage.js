
import '../App.css';
import { useState, useEffect } from 'react';
import Menu from "../menu/Menu";
import CheckoutPage from './CheckoutPage';
import PaymentPage from './PaymentPage';
import { pastries, cakes, hotDrinks, coldDrinks } from '../menu/MenuData';
import { AnimatePresence, motion } from "framer-motion";

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [orderTip, setOrderTip] = useState(0);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    securityCode: ''
  });
  const [showOrderModal, setShowOrderModal] = useState(false);

  const handleAddToOrder = (newItem) => {
    setOrderItems(prev => {
      const existingIndex = prev.findIndex((o) => o.id === newItem.id);
      let updated = [...prev];
      if (existingIndex >= 0) {
        updated[existingIndex] = newItem;
      } else {
        updated = [...prev, newItem];
      }
      return updated.filter(o => o.qty > 0);
    });

  };

  const handleCancelOrder = () => {
    // Clear parent state
    setOrderItems([]);
    setShowCheckout(false);
    setShowPayment(false);
    setPaymentProcessed(false);
    setFinalTotal(0);
    setOrderNumber(0);
    setOrderTip(0);
    setPaymentForm({ cardNumber: '', expiryDate: '', securityCode: '' });

    // Bump resetKey to force Menu components to remount and clear their internal state
    setResetKey(prev => prev + 1);

    // Ensure view is reset to top
    window.scrollTo(0, 0);
  };

  const handleFinalTotal = (total) => {
    setFinalTotal(total);
  };

  const handleOrderNumber = (orderNumber) => {
    setOrderNumber(orderNumber);
  };

  const handleBackToCheckout = () => {
    setShowCheckout(true);
    setShowPayment(false);
  };

  const handlePaymentSubmit = (paymentData) => {
    setPaymentProcessed(true);
  };  

  const handleViewOrder = () => {
    setShowOrderModal(true);
    window.scrollTo(0, 0);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
  };
  
  useEffect(() => console.log('Current Order:', orderItems), [orderItems]);

  return (
    <div className="App">
      <h3 id="top">Place Order</h3>
      <div className="Row Indent menu-links" style={{ gap: '25px' }} hidden={showCheckout}>
        <a href="#pastries">Pastries</a>
        <a href="#cakes">Cakes</a>
        <a href="#hotDrinks">Hot Drinks</a>
        <a href="#coldDrinks">Cold Drinks</a>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}>Top</a>
        <p></p>

        <div className="Row Indent" hidden={orderItems.length === 0 || showCheckout}>
          <button className="btn btn-outline-primary" onClick={handleCancelOrder}>Cancel Order</button>
          <button className="btn btn-primary" onClick={() => setShowCheckout(true)}>Checkout</button>
        </div>
      </div>
      
      <div hidden={showCheckout}>
        <p id="pastries" style={{color: "white"}}>.</p>
        <Menu key={`pastries-${resetKey}`} menu="Pastries" action="order" data={pastries} onAddToOrder={handleAddToOrder} />
        <p id="cakes" style={{color: "white"}}>.</p>
        <Menu key={`cakes-${resetKey}`} menu="Cakes" action="order" data={cakes} onAddToOrder={handleAddToOrder} />
        <p id="hotDrinks" style={{color: "white"}}>.</p>
        <Menu key={`hotDrinks-${resetKey}`} menu="Hot Drinks" action="order" data={hotDrinks} onAddToOrder={handleAddToOrder} />
        <p id="coldDrinks" style={{color: "white"}}>.</p>
        <Menu key={`coldDrinks-${resetKey}`} menu="Cold Drinks" action="order" data={coldDrinks} onAddToOrder={handleAddToOrder} />
      </div>

      <AnimatePresence mode="wait">
        {showCheckout && !showPayment && (
          <motion.div
            key="checkout"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <CheckoutPage 
              type="order"
              data={orderItems} 
              onTotalChange={handleFinalTotal} 
              onOrderNumber={handleOrderNumber} 
              orderTip={orderTip}
              setOrderTip={setOrderTip}
              parentOrderNumber={orderNumber}
            />

            <div className="Row Indent">
              <button className="btn btn-outline-primary" onClick={handleCancelOrder}>Cancel Order</button>
              <button className="btn btn-outline-primary" onClick={() => setShowCheckout(false)}>Update Order</button>
              <button className="btn btn-primary" onClick={() => setShowPayment(true)}>Pay Order</button>
            </div>
          </motion.div>
        )}

        {showPayment && (
          <motion.div
            key="payment"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <PaymentPage
              total={finalTotal}
              onSubmitPayment={handlePaymentSubmit}
              onCancelOrder={handleCancelOrder}
              onBackToCheckout={handleBackToCheckout}
              orderNumber={orderNumber}
              paymentForm={paymentForm}
              setPaymentForm={setPaymentForm}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="Row Indent" hidden={!showPayment || !paymentProcessed}>
        <button className="btn btn-outline-primary" onClick={handleCancelOrder}>Place New Order</button>
        <button className="btn btn-success" onClick={handleViewOrder}>View Order</button>
      </div>

      <AnimatePresence mode="wait">
        {showOrderModal && (
          <motion.div
            className="modal-backdrop"
            key="orderModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleCloseOrderModal}
          >
            <motion.div
              className="modal-content-container"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={handleCloseOrderModal} aria-label="Close order modal">
                ×
              </button>
              <CheckoutPage 
                type="view"
                data={orderItems} 
                onTotalChange={handleFinalTotal} 
                onOrderNumber={handleOrderNumber} 
                orderTip={orderTip}
                setOrderTip={setOrderTip}
                parentOrderNumber={orderNumber}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}