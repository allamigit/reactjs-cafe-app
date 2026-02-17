
import '../App.css'; 
import { useState, useRef, useEffect } from 'react';

export default function Payment(
  { total, onSubmitPayment, onCancelOrder, onBackToCheckout, orderNumber, paymentForm, setPaymentForm }) {
    
  const { cardNumber = '', expiryDate = '', securityCode = '' } = paymentForm || {};
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  // Processing states
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  const validate = () => {
    const newErrors = {};

    // Card number: must be 16 digits
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    // Expiry date: must match MM/YY
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiryDate)) {
      newErrors.expiryDate = 'Expiry must be in MM/YY format';
    }

    // Security code: 3 digits
    if (securityCode.length < 3) {
      newErrors.securityCode = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update parent payment form state
  const updateField = (field, value) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCardChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(.{4})/g, '$1 ').trim();
    updateField('cardNumber', formatted);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 5);
    if (value.length >= 3) value = value.slice(0, 2) + '/' + value.slice(2);
    updateField('expiryDate', value);
  };

  const simulatePayment = (cleanCard) => {
    // Map of specific test card numbers to fail messages
    const failScenarios = {
      '4000000000000003': 'Card was declined. Please try another payment method.',
      '4000000000000005': 'Insufficient funds on card.'
    };
    return failScenarios[cleanCard] || null;
  };

  // Start a simulated processing animation (progress bar)
  const startProcessing = (paymentData) => {
    setProcessing(true);
    setProgress(0);

    // Animate progress to 100% over 4 seconds
    const duration = 4000;
    const tick = 50;
    const steps = Math.ceil(duration / tick);
    let currentStep = 0;

    progressRef.current = setInterval(() => {
      currentStep += 1;
      const pct = Math.min(100, Math.round((currentStep / steps) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progressRef.current);
        progressRef.current = null;

        // Small pause to let UI show 100%
        setTimeout(() => {
          const cleanCard = paymentData.cardNumber.replace(/\s/g, '');
          const failReason = simulatePayment(cleanCard);

          if (failReason) {
            setProcessing(false);
            setFailed(true);
            setFailMessage(failReason);
            setProgress(0);
            return;
          }

          // Call parent submit handler
          if (onSubmitPayment) onSubmitPayment(paymentData);

          setProcessing(false);
          setSubmitted(true);
        }, 300);
      }
    }, tick);
  };

  useEffect(() => {
    // Clean up interval if component unmounts unexpectedly
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const handleBack = () => {
    setErrors({});
    setFailed(false);
    setFailMessage('');
    onBackToCheckout();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) {
      return;
    }

    const paymentData = {
      cardNumber,
      expiryDate,
      securityCode,
      total
    };

    // Kick off fake processing animation, then submit
    startProcessing(paymentData);
  };

  const handleRetry = () => {
    setErrors({});
    setFailed(false);
    setFailMessage('');
    setProgress(0);
  };
  
  return (
    <div className="App">
      <h3>Payment</h3>
      <p style={{ textAlign: "center", marginTop: "20px", color: 'rgb(252, 142, 102)', fontWeight: 'bold' }} hidden={submitted}>
        Total Amount Due: <u>${total.toFixed(2)}</u>
      </p>

      {!submitted ? (
        <form className="payment-form" onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
          {/* Card Number */}
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label htmlFor="cardNumber">Credit Card Number</label>
            <input
              type="text"
              inputMode="numeric"
              id="cardNumber"
              className="form-control"
              style={{ borderColor: errors.cardNumber ? 'red' : undefined }}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardChange}
              disabled={processing}
            />
            {errors.cardNumber && (
              <small style={{ color: 'red' }}>{errors.cardNumber}</small>
            )}
          </div>

          {/* Expiry + CVV */}
          <div className="form-row" onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                inputMode="numeric"
                id="expiryDate"
                className="form-control"
                style={{ borderColor: errors.expiryDate ? 'red' : undefined }}
                placeholder="MM/YY"
                maxLength="5"
                value={expiryDate}
                onChange={handleExpiryChange}
                disabled={processing}
              />
              {errors.expiryDate && (
                <small style={{ color: 'red' }}>{errors.expiryDate}</small>
              )}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="securityCode">Security Code (CVV)</label>
              <input
                type="password"
                inputMode="numeric"
                id="securityCode"
                className="form-control"
                style={{ borderColor: errors.securityCode ? 'red' : undefined }}
                maxLength="3"
                placeholder="123"
                value={securityCode}
                onChange={(e) => updateField('securityCode', e.target.value.replace(/\D/g, '').slice(0,3))}
                disabled={processing}
              />
              {errors.securityCode && (
                <small style={{ color: 'red' }}>{errors.securityCode}</small>
              )}
            </div>
          </div>

          {/* Processing UI */}
          {processing && (
            <div style={{ marginTop: 16 }}>
              <div className="mb-2" style={{ textAlign: 'center' }}>Processing Payment...</div>

              {/* Bootstrap-like progress bar */}
              <div className="progress" style={{ height: '18px' }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {progress}%
                </div>
              </div>
            </div>
          )}

          {/* Failure alert */}
          {failed && (
            <div className="alert alert-danger mt-3" role="alert" style={{ textAlign: 'center' }}>
              ❌ {failMessage}
            </div>
          )}
          
          {/* Buttons */}
          <div className="Row" style={{ marginTop: '15px', justifyContent: 'center', gap: '8px' }}>
            <button className="btn btn-outline-primary" type="button" onClick={onCancelOrder} disabled={processing}>
                Cancel Order
            </button>
            <button className="btn btn-outline-primary" type="button" onClick={handleBack} disabled={processing}>
                Back to Checkout
            </button>

            {!failed ? (
              <button className="btn btn-success" type="submit" disabled={processing}>
                {processing ? 'Processing…' : 'Submit Payment'}
              </button>
            ) : (
              <button className="btn btn-warning" type="button" onClick={handleRetry}>
                Retry Payment
              </button>
            )}
          </div>
        </form>
      ) : (
        <div style={{ justifyItems: 'center', marginTop: "30px" }}>
          {/*<h4 style={{ fontSize: "1.4em", marginLeft: "0px" }}>✅ Payment Submitted Successfully</h4>
          <h5 style={{ marginTop: "20px" }}>Your Order# {orderNumber}, please check the Pickup counter</h5>*/}
          <div className="alert alert-success mt-3" role="alert" style={{ textAlign: 'center', width: '450px' }}>
            ✅ Payment Submitted Successfully
          </div>
          <div className="alert alert-warning mt-3" role="alert" style={{ textAlign: 'center', width: '450px' }}>
            Your <strong>Order# {orderNumber}</strong> has been submitted. Please proceed to the pickup counter upon arriving at the store
          </div>
        </div>
      )}
    </div>
  );
}
