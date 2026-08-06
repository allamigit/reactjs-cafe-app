import { createContext, useContext, useMemo, useState } from 'react';

/**
1- OrderPage, Menu, CheckoutPage, and future pages all need access to the current order
2- Context avoids prop-drilling state like orderItems, total, orderTip, and add/remove handlers
3- It makes the app easier to extend with a navbar cart badge, persistent cart preview, or shared order state across routes

OrderPage.js
------------
Uses useOrder() instead of local order data
Keeps modal / checkout flow working
Uses context-reset for cancel order

Menu.js
-------
Uses useOrder() to add items into shared order state
Falls back to props.onAddToOrder if still supplied

CheckoutPage.js
---------------
Uses context order data and tip state
Keeps print/PDF export behavior intact
 */

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orderItems, setOrderItems] = useState([]);
  const [orderTip, setOrderTip] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);

  const orderTotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + (item.total || 0), 0),
    [orderItems]
  );

  const finalTotal = useMemo(
    () => orderTotal + Number(orderTip),
    [orderTotal, orderTip]
  );

  const addToOrder = (newItem) => {
    setOrderItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === newItem.id);
      let updated = [...prev];

      if (existingIndex >= 0) {
        updated[existingIndex] = newItem;
      } else {
        updated = [...prev, newItem];
      }

      return updated.filter((item) => item.qty > 0);
    });
  };

  const removeOrderItem = (itemId) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const resetOrder = () => {
    setOrderItems([]);
    setOrderTip(0);
    setOrderNumber(0);
  };

  return (
    <OrderContext.Provider
      value={{
        orderItems,
        orderTip,
        setOrderTip,
        orderNumber,
        setOrderNumber,
        orderTotal,
        finalTotal,
        addToOrder,
        removeOrderItem,
        resetOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
