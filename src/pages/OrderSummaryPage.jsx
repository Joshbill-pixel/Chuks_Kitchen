import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';
import { CheckCircle, XCircle, Tag } from 'lucide-react';

// Pre-defined promo codes (in production, this comes from backend)
const VALID_PROMO_CODES = {
  'WELCOME10': { discount: 0.10, type: 'percentage', maxDiscount: 2000, description: '10% off your order' },
  'CHUKS20': { discount: 0.20, type: 'percentage', maxDiscount: 5000, description: '20% off your order' },
  'FREEDELIVERY': { discount: 500, type: 'fixed', description: 'Free delivery' },
  'SAVE500': { discount: 500, type: 'fixed', description: '₦500 off' },
  'FIRSTORDER': { discount: 0.15, type: 'percentage', maxDiscount: 3000, description: '15% off first order' },
};

export function OrderSummaryPage() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const subtotal = getCartTotal();
  const deliveryFee = deliveryMethod === 'delivery' ? 500 : 0;
  const serviceFee = 200;
  
  // Calculate discount
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    const promo = VALID_PROMO_CODES[appliedPromo.code];
    if (!promo) return 0;
    
    if (promo.type === 'percentage') {
      const discount = subtotal * promo.discount;
      return Math.min(discount, promo.maxDiscount || discount);
    } else {
      // Fixed amount - cap at subtotal
      return Math.min(promo.discount, subtotal);
    }
  };
  
  const discount = calculateDiscount();
  const tax = 0;
  const total = Math.max(0, subtotal + deliveryFee + serviceFee + tax - discount);

  // Load saved promo from localStorage on mount
  useEffect(() => {
    const savedPromo = localStorage.getItem('appliedPromo');
    if (savedPromo) {
      try {
        const parsed = JSON.parse(savedPromo);
        // Check if promo is still valid (e.g., not expired)
        if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
          setAppliedPromo(parsed);
          setPromoCode(parsed.code);
        } else {
          localStorage.removeItem('appliedPromo');
        }
      } catch (e) {
        localStorage.removeItem('appliedPromo');
      }
    }
  }, []);

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    
    if (!code) {
      setPromoError('Please enter a promo code');
      return;
    }
    
    if (appliedPromo && appliedPromo.code === code) {
      setPromoError('This promo code is already applied');
      return;
    }
    
    setPromoLoading(true);
    setPromoError('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const promo = VALID_PROMO_CODES[code];
    
    if (!promo) {
      setPromoError('Invalid promo code. Try: WELCOME10, CHUKS20, FREEDELIVERY, SAVE500');
      setPromoLoading(false);
      return;
    }
    
    // Check minimum order requirements
    if (code === 'FIRSTORDER') {
      const hasOrderedBefore = localStorage.getItem('hasOrdered');
      if (hasOrderedBefore) {
        setPromoError('This code is only valid for first-time orders');
        setPromoLoading(false);
        return;
      }
    }
    
    // Apply promo
    const promoData = {
      code,
      ...promo,
      appliedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };
    
    setAppliedPromo(promoData);
    localStorage.setItem('appliedPromo', JSON.stringify(promoData));
    setPromoLoading(false);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
    localStorage.removeItem('appliedPromo');
  };

  const handleProceed = () => {
    // Save order summary data
    const orderData = {
      subtotal,
      deliveryFee,
      serviceFee,
      discount,
      tax,
      total,
      deliveryMethod,
      specialInstructions,
      appliedPromo: appliedPromo ? { code: appliedPromo.code, discount } : null,
    };
    localStorage.setItem('orderSummary', JSON.stringify(orderData));
    
    navigate('/delivery-details');
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Order Summary
            </h1>

            {/* Promo Code Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Add a Promo Code
              </h3>
              
              {!appliedPromo ? (
                <div className="space-y-2">
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      placeholder="Enter code (e.g., WELCOME10)"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoError('');
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                      className={`flex-1 uppercase ${promoError ? 'border-red-500' : ''}`}
                      disabled={promoLoading}
                    />
                    <Button
                      onClick={handleApplyPromo}
                      disabled={promoLoading}
                      className="bg-orange-500 hover:bg-orange-600 px-6 disabled:opacity-50"
                    >
                      {promoLoading ? 'Applying...' : 'Apply'}
                    </Button>
                  </div>
                  
                  {promoError && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <XCircle className="w-4 h-4" />
                      {promoError}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Try: WELCOME10 (10% off), FREEDELIVERY, or SAVE500
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">
                          {appliedPromo.code} Applied!
                        </p>
                        <p className="text-sm text-green-700">
                          {appliedPromo.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemovePromo}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    You saved ₦{discount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              
              {appliedPromo && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    Discount ({appliedPromo.code})
                  </span>
                  <span>-₦{discount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Fee</span>
                <span>₦{serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₦{tax.toLocaleString()}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-4 mb-6">
              <span>Total</span>
              <div className="text-right">
                {appliedPromo && (
                  <p className="text-sm font-normal text-gray-500 line-through">
                    ₦{(subtotal + deliveryFee + serviceFee + tax).toLocaleString()}
                  </p>
                )}
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery Method Toggle */}
            <div className="flex rounded-lg overflow-hidden mb-6">
              <button
                onClick={() => setDeliveryMethod('delivery')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  deliveryMethod === 'delivery'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                Delivery
              </button>
              <button
                onClick={() => setDeliveryMethod('pickup')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  deliveryMethod === 'pickup'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                Pick up
              </button>
            </div>

            {/* Special Instructions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Special Instructions for Restaurant
              </h3>
              <Textarea
                placeholder="E.g no onion, less spicy, allergies..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Proceed Button */}
            <Button
              onClick={handleProceed}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-base rounded-lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OrderSummaryPage;