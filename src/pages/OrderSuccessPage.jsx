import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, FileText, HelpCircle, X, Download, Printer, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';

export function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart, cartItems, getCartTotal } = useCart();
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const receiptRef = useRef(null);

  // Get order data from location state or localStorage
  const orderData = location.state?.paymentData || JSON.parse(localStorage.getItem('lastOrder') || '{}');
  const orderSummary = JSON.parse(localStorage.getItem('orderSummary') || '{}');
  
  const orderNumber = orderData.transactionId || `CHK-${Date.now().toString(36).toUpperCase()}`;
  const orderDate = new Date().toLocaleString('en-NG', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleTrackOrder = () => {
    clearCart();
    localStorage.removeItem('appliedPromo');
    localStorage.removeItem('orderSummary');
    navigate('/orders');
  };

  const handleGenerateReceipt = () => {
    setShowReceiptModal(true);
  };

  const handleDownloadReceipt = () => {
    const receiptContent = generateReceiptText();
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chuks-Kitchen-Receipt-${orderNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generateReceiptHTML());
    printWindow.document.close();
    printWindow.print();
  };

  const handleShareReceipt = async () => {
    const shareData = {
      title: 'Chuks Kitchen Order',
      text: `I just ordered from Chuks Kitchen! Order #${orderNumber}. Total: ₦${(orderSummary.total || getCartTotal()).toLocaleString()}`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.text);
      alert('Receipt details copied to clipboard!');
    }
  };

  const generateReceiptText = () => {
    const items = cartItems.map(item => {
      const desc = [];
      if (item.selectedProtein) {
        const protein = item.foodItem.proteinOptions?.find(p => p.id === item.selectedProtein);
        if (protein) desc.push(protein.name);
      }
      if (item.selectedSides?.length) {
        const sides = item.selectedSides.map(s => {
          const side = item.foodItem.sideOptions?.find(so => so.id === s);
          return side?.name;
        }).filter(Boolean);
        desc.push(...sides);
      }
      
      return `${item.foodItem.name}
Qty: ${item.quantity} x ₦${item.totalPrice.toLocaleString()} = ₦${(item.quantity * item.totalPrice).toLocaleString()}
${desc.length ? `Options: ${desc.join(', ')}` : ''}`;
    }).join('\n\n');

    return `================================
      CHUKS KITCHEN
   Authentic Nigerian Cuisine
================================

RECEIPT
--------------------------------
Order #: ${orderNumber}
Date: ${orderDate}
Status: PAID

--------------------------------
ITEMS:
--------------------------------
${items}

--------------------------------
PAYMENT SUMMARY:
--------------------------------
Subtotal:        ₦${(orderSummary.subtotal || getCartTotal()).toLocaleString()}
${orderSummary.discount ? `Discount:       -₦${orderSummary.discount.toLocaleString()}` : ''}
Delivery Fee:    ₦${(orderSummary.deliveryFee || 500).toLocaleString()}
Service Fee:     ₦${(orderSummary.serviceFee || 200).toLocaleString()}
Tax:             ₦${(orderSummary.tax || 0).toLocaleString()}
--------------------------------
TOTAL:           ₦${(orderSummary.total || getCartTotal() + 700).toLocaleString()}
--------------------------------

Payment Method: ${orderData.method?.toUpperCase() || 'CARD'}
Transaction ID: ${orderData.transactionId || orderNumber}

--------------------------------

Thank you for choosing Chuks Kitchen!
Your delicious meal is being prepared.

For support: support@chukkitchen.com
Phone: +234 801 234 5678

================================
`;
  };

  const generateReceiptHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${orderNumber}</title>
        <style>
          body { font-family: 'Courier New', monospace; max-width: 400px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
          .item { margin: 10px 0; border-bottom: 1px dotted #ccc; padding-bottom: 5px; }
          .total { font-weight: bold; border-top: 2px solid #000; margin-top: 10px; padding-top: 10px; }
          .center { text-align: center; }
          .right { text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>CHUKS KITCHEN</h2>
          <p>Authentic Nigerian Cuisine</p>
        </div>
        <p>Order #: ${orderNumber}</p>
        <p>Date: ${orderDate}</p>
        <hr>
        ${cartItems.map(item => `
          <div class="item">
            <strong>${item.foodItem.name}</strong><br>
            Qty: ${item.quantity} x ₦${item.totalPrice.toLocaleString()}
            <span class="right" style="float:right">₦${(item.quantity * item.totalPrice).toLocaleString()}</span>
          </div>
        `).join('')}
        <div class="total">
          <p>Subtotal: <span class="right" style="float:right">₦${(orderSummary.subtotal || getCartTotal()).toLocaleString()}</span></p>
          ${orderSummary.discount ? `<p>Discount: <span class="right" style="float:right">-₦${orderSummary.discount.toLocaleString()}</span></p>` : ''}
          <p>Delivery: <span class="right" style="float:right">₦${(orderSummary.deliveryFee || 500).toLocaleString()}</span></p>
          <p>Service: <span class="right" style="float:right">₦${(orderSummary.serviceFee || 200).toLocaleString()}</span></p>
          <p style="font-size: 1.2em; margin-top: 10px;">TOTAL: <span class="right" style="float:right">₦${(orderSummary.total || getCartTotal() + 700).toLocaleString()}</span></p>
        </div>
        <div class="center" style="margin-top: 30px;">
          <p>Thank you for your order!</p>
          <p style="font-size: 0.9em; color: #666;">Chuks Kitchen - Taste of Home</p>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 flex items-center justify-center py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-500 mb-8">
            Your delicious Chuks Kitchen meal is on its way!
          </p>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order #{orderNumber.slice(-12)} Confirmed
            </h3>
            <Button
              onClick={handleTrackOrder}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg mb-4"
            >
              Track Order
            </Button>
            <button
              onClick={handleGenerateReceipt}
              className="flex items-center justify-center gap-2 w-full text-gray-600 hover:text-orange-600 py-2 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Generate Receipt
            </button>
          </div>

          {/* Help Link */}
          <button
            onClick={() => navigate('/support')}
            className="flex items-center justify-center gap-2 text-orange-500 hover:underline mx-auto"
          >
            <HelpCircle className="w-4 h-4" />
            Need help with your order?
          </button>
        </div>
      </main>

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-orange-500 text-white p-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Order Receipt
              </h3>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1 hover:bg-orange-600 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]" ref={receiptRef}>
              {/* Receipt Header */}
              <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">CHUKS KITCHEN</h2>
                <p className="text-sm text-gray-500">Authentic Nigerian Cuisine</p>
                <p className="text-xs text-gray-400 mt-1">www.chukkitchen.com</p>
              </div>

              {/* Order Info */}
              <div className="space-y-1 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order #:</span>
                  <span className="font-mono font-medium">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">PAID ✓</span>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <h4 className="font-semibold text-sm mb-3 text-gray-700">ORDER ITEMS</h4>
                <div className="space-y-3">
                  {cartItems.map((item, index) => {
                    const desc = [];
                    if (item.selectedProtein) {
                      const protein = item.foodItem.proteinOptions?.find(p => p.id === item.selectedProtein);
                      if (protein) desc.push(protein.name);
                    }
                    if (item.selectedSides?.length) {
                      const sides = item.selectedSides.map(s => {
                        const side = item.foodItem.sideOptions?.find(so => so.id === s);
                        return side?.name;
                      }).filter(Boolean);
                      desc.push(...sides);
                    }

                    return (
                      <div key={item.id} className="text-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.foodItem.name}</p>
                            {desc.length > 0 && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {desc.join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-medium">₦{(item.quantity * item.totalPrice).toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{item.quantity} x ₦{item.totalPrice.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{(orderSummary.subtotal || getCartTotal()).toLocaleString()}</span>
                </div>
                {orderSummary.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({orderSummary.appliedPromo?.code})</span>
                    <span>-₦{orderSummary.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{orderSummary.deliveryFee === 0 ? 'FREE' : `₦${(orderSummary.deliveryFee || 500).toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>₦{(orderSummary.serviceFee || 200).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₦{(orderSummary.tax || 0).toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold text-gray-900">
                  <span>TOTAL</span>
                  <span>₦{(orderSummary.total || getCartTotal() + 700).toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 rounded-lg p-3 text-sm mb-4">
                <p className="text-gray-600 mb-1">Payment Method</p>
                <p className="font-medium text-gray-900 uppercase">{orderData.method || 'CARD'}</p>
                <p className="text-xs text-gray-500 mt-1">Transaction ID: {orderData.transactionId || orderNumber}</p>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 pt-4 border-t border-dashed">
                <p className="font-medium text-gray-700 mb-1">Thank you for choosing Chuks Kitchen!</p>
                <p>Your delicious meal is being prepared with ❤️</p>
                <p className="mt-2">For support: support@chukkitchen.com</p>
                <p>+234 801 234 5678</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t p-4 bg-gray-50 space-y-2">
              <Button
                onClick={handleDownloadReceipt}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt (.txt)
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrintReceipt}
                  className="flex-1"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShareReceipt}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default OrderSuccessPage;