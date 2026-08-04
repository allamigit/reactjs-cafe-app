
import '../App.css';
import { useState, useEffect, useMemo } from 'react';
import html2pdf from "html2pdf.js";

export default function CheckoutPage(props) {
    const [localOrderNumber] = useState(() => props.parentOrderNumber || Math.floor(Math.random() * 100));
    const orderNumber = props.parentOrderNumber || localOrderNumber;    
    const [orderDate] = useState(new Date());
    const orderTip = props.orderTip ?? 0;
    const setOrderTip = props.setOrderTip ?? (() => {});

    const order = useMemo(() => ({
        orderNumber,
        orderDate,
        orderItems: props.data || []
    }), [orderNumber, orderDate, props.data]);

    const orderTotal = useMemo(() => {
        return order.orderItems.reduce((sum, item) => sum + (item.total || 0), 0);
    }, [order.orderItems]);

    const finalTotal = useMemo(() => {
        return orderTotal + Number(orderTip);
    }, [orderTotal, orderTip]);

    // Notify Order.js with the updated final total
    useEffect(() => {
        if (props.onTotalChange) {
            props.onTotalChange(finalTotal);
        }
    }, [props, finalTotal]);

    // Notify Order.js with the order number, but only if parent hasn't provided one
    useEffect(() => {
        if (!props.parentOrderNumber && props.onOrderNumber) {
            props.onOrderNumber(orderNumber);
        } else if (props.parentOrderNumber && props.onOrderNumber) {
            // Ensure parent knows provided orderNumber
            props.onOrderNumber(props.parentOrderNumber);
        }
    }, [props, orderNumber]);
    
    const handleDownloadPDF = () => {
        const element = document.getElementById('print-area');
        const buttons = element.querySelectorAll('.invoice-actions');
        const checkoutContainer = element.querySelector('.checkout-container');
        const originalStyles = {
            maxHeight: checkoutContainer?.style.maxHeight || '',
            overflow: checkoutContainer?.style.overflow || ''
        };

        if (checkoutContainer) {
            checkoutContainer.style.maxHeight = 'none';
            checkoutContainer.style.overflow = 'visible';
        }

        // Hide buttons before generating PDF
        buttons.forEach(btn => (btn.style.display = 'none'));

        const options = {
            filename: `Order_${order.orderNumber}.pdf`,
            margin: 0.5,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        };

        html2pdf()
            .set(options)
            .from(element)
            .save()
            .then(() => {
                // Restore buttons after PDF download completes
                buttons.forEach(btn => (btn.style.display = 'flex'));
                if (checkoutContainer) {
                    checkoutContainer.style.maxHeight = originalStyles.maxHeight;
                    checkoutContainer.style.overflow = originalStyles.overflow;
                }
            });
    };

    const handlePrint = () => {
        const element = document.getElementById('print-area');
        if (!element) return;

        const originalDisplay = element.style.display;
        element.style.display = 'none';

        const clone = element.cloneNode(true);
        clone.id = 'print-area-print';
        clone.style.position = 'relative';
        clone.style.visibility = 'visible';
        clone.style.display = 'block';

        const checkoutContainer = clone.querySelector('.checkout-container');
        if (checkoutContainer) {
            checkoutContainer.style.maxHeight = 'none';
            checkoutContainer.style.overflow = 'visible';
        }

        const printWrapper = document.createElement('div');
        printWrapper.id = 'print-area-print-wrapper';
        printWrapper.style.position = 'fixed';
        printWrapper.style.top = '0';
        printWrapper.style.left = '0';
        printWrapper.style.width = '100%';
        printWrapper.style.zIndex = '9999';
        printWrapper.style.background = '#fff';
        printWrapper.appendChild(clone);
        document.body.appendChild(printWrapper);

        const cleanup = () => {
            document.body.removeChild(printWrapper);
            element.style.display = originalDisplay;
            window.onafterprint = null;
        };

        window.onafterprint = cleanup;
        window.print();
    };

    useEffect(() => {
        console.log('Checkout Current Order:', order);
    }, [order]);

    return (
        <div className="App">
            <h3 style={{ color: 'orange' }}>{props.type === 'order' ? 'Checkout' : 'View Order'}</h3>

            <div id="print-area" className="invoice-box">
                <div className="Row Indent invoice-header">
                    <div style={{ textAlign: 'left' }}>
                        <h5>Order# {order.orderNumber}</h5>
                        <h5>
                            Date:{' '}
                            {order.orderDate.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '')}
                        </h5>
                    </div>
                    <div className="invoice-actions">
                            <button className="btn btn-outline-primary" style={{ width: "80px"}} onClick={handlePrint}>
                            Print
                        </button>
                        <button className="btn btn-outline-primary" style={{ width: "80px"}} onClick={handleDownloadPDF}>
                            PDF
                        </button>                    
                    </div>
                </div>


                <div className="checkout-container">
                    {order.orderItems.length === 0 ? (
                        <p>No items in your order.</p>
                    ) : (
                        <table className="checkout-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.orderItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <strong>{item.name}</strong>
                                            {(item.ice || item.sugar || item.milk) && (
                                                <div className="item-options">
                                                    {item.ice && <span>✅ Ice</span>}
                                                    {item.sugar && <span>✅ Sugar</span>}
                                                    {item.milk && <span>✅ {item.milk}</span>}
                                                </div>
                                            )}
                                            {(!item.ice || !item.sugar || !item.milk) && (
                                                <div className="item-options">
                                                    {!item.ice && item.id.startsWith("CD-") && <span>❌ Ice</span>}
                                                    {!item.sugar && item.addIn2 && <span>❌ Sugar</span>}
                                                    {!item.milk && item.milk !== null && <span>❌ {item.milk}</span>}
                                                </div>
                                            )}
                                        </td>
                                        <td>{item.qty}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>${item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                        Sub-Total:
                                    </td>
                                    <td style={{ fontWeight: 'bold' }}>
                                        ${orderTotal.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                        Tip:
                                    </td>
                                    <td style={{ fontWeight: 'bold' }}>
                                        $<input 
                                            className="form-control" 
                                            style={{ width: '80px', display: 'inline-block' }}
                                            type="number"
                                            inputMode="numeric"
                                            step="0.50"
                                            min="0"
                                            name="orderTip" 
                                            value={orderTip.toFixed(2)} 
                                            onChange={(e) => setOrderTip(parseFloat(e.target.value) || 0)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                        Total:
                                    </td>
                                    <td style={{ fontWeight: 'bold' }}>
                                        ${finalTotal.toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
