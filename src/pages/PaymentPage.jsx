import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Building2, ArrowRightLeft, Lock, Shield, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';

export function PaymentPage() {
  const navigate = useNavigate();
  const { getCartTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    saveCard: false,
  });

  const total = getCartTotal() + 500 + 200; // subtotal + delivery + service

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateCard = () => {
    const newErrors = {};

    // Expiry validation
    const [month, year] = (cardDetails.expiry || '').split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (!month || !year || month > 12 || month < 1) {
      newErrors.expiry = 'Invalid expiry date';
    } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      newErrors.expiry = 'Card has expired';
    }

    // CVV validation
    if (!/^\d{3}$/.test(cardDetails.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    // Name validation
    if (cardDetails.name.length < 3) {
      newErrors.name = 'Please enter cardholder name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card' && !validateCard()) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate 3D Secure authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment processing
      const paymentData = {
        method: paymentMethod,
        amount: total,
        timestamp: new Date().toISOString(),
        transactionId: 'TXN-' + Date.now(),
        status: 'completed',
      };
      
      // Store payment info securely (in real app, only store last 4 digits)
      localStorage.setItem('lastPayment', JSON.stringify({
        method: paymentMethod,
        last4: paymentMethod === 'card' ? cardDetails.number.slice(-4) : null,
        timestamp: paymentData.timestamp,
      }));
      
      navigate('/card-loading', { state: { paymentData } });
    } catch (error) {
      setErrors({ submit: 'Payment failed. Please try again or use a different method.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 text-green-600">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Secure SSL Encrypted Transaction</span>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Payment
            </h1>
            <p className="text-gray-500 mb-6">Complete your order securely</p>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pay With:</h3>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'card', icon: CreditCard, label: 'Card' },
                  { id: 'bank', icon: Building2, label: 'Bank' },
                  { id: 'transfer', icon: ArrowRightLeft, label: 'Transfer' },
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className={`flex items-center gap-3 px-6 py-4 border-2 rounded-lg transition-all ${
                      paymentMethod === id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === id ? 'border-orange-500' : 'border-gray-300'
                      }`}
                    >
                      {paymentMethod === id && (
                        <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                      )}
                    </div>
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-6">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardDetails.number}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setCardDetails({ ...cardDetails, number: formatted });
                    }}
                    className="py-3"
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <Input
                    type="text"
                    placeholder="JOHN DOE"
                    value={cardDetails.name}
                    onChange={(e) => {
                      setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    className={`py-3 ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardDetails.expiry}
                      onChange={(e) => {
                        const formatted = formatExpiry(e.target.value);
                        setCardDetails({ ...cardDetails, expiry: formatted });
                        if (errors.expiry) setErrors({ ...errors, expiry: undefined });
                      }}
                      className={`py-3 ${errors.expiry ? 'border-red-500' : ''}`}
                    />
                    {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                  </div>
                  
                  {/* CVV */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV <span className="text-gray-400 text-xs">(3 digits)</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardDetails.cvv}
                        onChange={(e) => {
                          setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') });
                          if (errors.cvv) setErrors({ ...errors, cvv: undefined });
                        }}
                        className={`py-3 ${errors.cvv ? 'border-red-500' : ''}`}
                      />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                  </div>
                </div>

                {/* Save Card */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="saveCard"
                    checked={cardDetails.saveCard}
                    onCheckedChange={(checked) =>
                      setCardDetails({ ...cardDetails, saveCard: checked })
                    }
                  />
                  <label htmlFor="saveCard" className="text-sm text-gray-600">
                    Save card for future payments (securely encrypted)
                  </label>
                </div>
              </div>
            )}

            {/* Bank Transfer Info */}
            {paymentMethod === 'bank' && (
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-4 text-blue-800">
                  <Building2 className="w-5 h-5" />
                  <h4 className="font-semibold">Bank Payment</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  You will be redirected to your bank's secure payment page to complete the transaction.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p className="font-medium text-gray-700">Supported banks:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['First Bank', 'GTBank', 'Access Bank', 'Zenith Bank', 'UBA', 'Union Bank'].map(bank => (
                      <div key={bank} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        {bank}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Transfer Info */}
            {paymentMethod === 'transfer' && (
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center gap-2 mb-4 text-green-800">
                  <ArrowRightLeft className="w-5 h-5" />
                  <h4 className="font-semibold">Bank Transfer</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Please transfer the exact amount to the account details below:
                </p>
                <div className="bg-white rounded-lg p-4 space-y-3 text-sm border">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Bank Name:</span>
                    <span className="font-semibold text-gray-900">GTBank</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Account Number:</span>
                    <span className="font-mono font-bold text-lg text-gray-900">0123456789</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Account Name:</span>
                    <span className="font-semibold text-gray-900">Chuks Kitchen Ltd</span>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-gray-500">Amount to pay:</span>
                    <span className="float-right font-bold text-orange-600">₦{total.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  * Your order will be confirmed once payment is received (usually within 5 minutes)
                </p>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mt-4">
                {errors.submit}
              </div>
            )}

            {/* Pay Button */}
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white py-6 text-base rounded-lg disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Pay ₦{total.toLocaleString()}
                </>
              )}
            </Button>

            {/* Security Note */}
            <div className="mt-6 flex items-start gap-2 text-xs text-gray-500">
              <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Your payment information is encrypted using SSL/TLS technology. 
                We do not store your full card details on our servers. 
                This transaction is protected by 3D Secure authentication.
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PaymentPage;