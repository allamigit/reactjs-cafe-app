
import '../App.css';
import { useState, useEffect } from 'react';
import Menu from "./Menu";
import Checkout from './Checkout';
import Payment from './Payment';
import { pastries, cakes, hotDrinks, coldDrinks } from '../menu/menuItems';
import { AnimatePresence, motion } from "framer-motion";

export default function Order() {
  const [orderItems, setOrderItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [orderTip, setOrderTip] = useState(0);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    securityCode: ''
  });

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
    setOrderItems(() => []);
    setShowCheckout(false);
    setShowPayment(false);
    setPaymentProcessed(false);
    setOrderTip(0);
    setPaymentForm({ cardNumber: '', expiryDate: '', securityCode: '' });
    window.location.reload();
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
  
  useEffect(() => console.log('Current Order:', orderItems), [orderItems]);

  return (
    <div className="App">
      <h3 id="top">Place Order</h3>
      <div className="Row Indent menu-links" style={{ gap: '25px' }} hidden={showCheckout}>
        <a href="#pastries">Pastries</a>
        <a href="#cakes">Cakes</a>
        <a href="#hotDrinks">Hot Drinks</a>
        <a href="#coldDrinks">Cold Drinks</a>
        <a href="#top">Top</a>
        <p></p>

        <div className="Row Indent" hidden={orderItems.length === 0 || showCheckout}>
          <button className="btn btn-outline-primary" onClick={handleCancelOrder}>Cancel Order</button>
          <button className="btn btn-primary" onClick={() => setShowCheckout(true)}>Checkout</button>
        </div>
      </div>
      
      <div hidden={showCheckout}>
        <p id="pastries" style={{color: "white"}}>.</p>
        <Menu menu="Pastries" action="order" data={pastries} onAddToOrder={handleAddToOrder} />
        <p id="cakes" style={{color: "white"}}>.</p>
        <Menu menu="Cakes" action="order" data={cakes} onAddToOrder={handleAddToOrder} />
        <p id="hotDrinks" style={{color: "white"}}>.</p>
        <Menu menu="Hot Drinks" action="order" data={hotDrinks} onAddToOrder={handleAddToOrder} />
        <p id="coldDrinks" style={{color: "white"}}>.</p>
        <Menu menu="Cold Drinks" action="order" data={coldDrinks} onAddToOrder={handleAddToOrder} />
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
            <Checkout 
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
            <Payment
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
        <button className="btn btn-primary" onClick={handleCancelOrder}>Place New Order</button>
      </div>
    </div>
  );
}