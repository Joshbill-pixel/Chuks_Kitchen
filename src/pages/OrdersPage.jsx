import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, CheckCircle, Truck, Package, X, MapPin, 
  CreditCard, RotateCcw, ChevronRight, Calendar, 
  Phone, Mail, User, ShoppingBag
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';

// Extended mock orders with full details
const mockOrders = [
  {
    id: 'ORD-123456',
    date: '2024-01-15',
    time: '14:30',
    items: [
      { 
        name: 'Jollof Rice & Fried Chicken', 
        quantity: 2, 
        price: 3500,
        image: '/images/jollof-rice-chicken.jpg',
        options: ['Fried Chicken', 'Extra Pepper Sauce']
      },
      { 
        name: 'Egusi Soup & Pounded Yam', 
        quantity: 1, 
        price: 3500,
        image: '/images/egusi-pounded-yam.jpg',
        options: ['Beef', 'Fried Plantain']
      }
    ],
    total: 10500,
    subtotal: 7000,
    deliveryFee: 500,
    serviceFee: 200,
    discount: 0,
    status: 'delivered',
    paymentMethod: 'card',
    cardLast4: '4242',
    deliveryAddress: '123 Main Street, Victoria Island, Lagos',
    deliveryMethod: 'delivery',
    estimatedTime: '30-45 mins',
    actualTime: '35 mins',
    rating: 5,
    specialInstructions: 'Please make the food extra spicy',
    restaurant: {
      name: 'Chuks Kitchen',
      phone: '+234 801 234 5678',
      email: 'support@chukkitchen.com'
    }
  },
  {
    id: 'ORD-123455',
    date: '2024-01-10',
    time: '19:15',
    items: [
      { 
        name: 'Spicy Tilapia Pepper Soup', 
        quantity: 1, 
        price: 3500,
        image: '/images/tilapia-pepper-soup.jpg',
        options: []
      }
    ],
    total: 4200,
    subtotal: 3500,
    deliveryFee: 500,
    serviceFee: 200,
    discount: 0,
    status: 'delivered',
    paymentMethod: 'transfer',
    deliveryAddress: '45 Adeola Odeku Street, Victoria Island, Lagos',
    deliveryMethod: 'delivery',
    estimatedTime: '40-50 mins',
    actualTime: '42 mins',
    rating: null,
    specialInstructions: '',
    restaurant: {
      name: 'Chuks Kitchen',
      phone: '+234 801 234 5678',
      email: 'support@chukkitchen.com'
    }
  },
  {
    id: 'ORD-123454',
    date: '2024-01-05',
    time: '12:00',
    items: [
      { 
        name: 'Jollof Rice & Smoked Chicken', 
        quantity: 1, 
        price: 3500,
        image: '/images/jollof-rice-smoked.jpg',
        options: ['Smoked Chicken']
      },
      { 
        name: 'Chin Chin', 
        quantity: 2, 
        price: 800,
        image: '/images/chin-chin.jpg',
        options: []
      },
      { 
        name: 'Puff Puff', 
        quantity: 1, 
        price: 600,
        image: '/images/puff-puff.jpg',
        options: []
      }
    ],
    total: 5600,
    subtotal: 4900,
    deliveryFee: 500,
    serviceFee: 200,
    discount: 0,
    status: 'delivered',
    paymentMethod: 'cash',
    deliveryAddress: 'Pickup at Restaurant',
    deliveryMethod: 'pickup',
    estimatedTime: '15-20 mins',
    actualTime: '18 mins',
    rating: 4,
    specialInstructions: '',
    restaurant: {
      name: 'Chuks Kitchen',
      phone: '+234 801 234 5678',
      email: 'support@chukkitchen.com'
    }
  },
];

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'preparing':
      return <Package className="w-5 h-5 text-orange-500" />;
    case 'out-for-delivery':
      return <Truck className="w-5 h-5 text-blue-500" />;
    case 'delivered':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'preparing':
      return 'Preparing';
    case 'out-for-delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    default:
      return 'Unknown';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'preparing':
      return 'bg-orange-100 text-orange-800';
    case 'out-for-delivery':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function OrdersPage() {
  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(null);
  const [notification, setNotification] = useState(null);

  // Load orders from localStorage or use mock data
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        setOrders([...parsed, ...mockOrders]);
      } catch (e) {
        setOrders(mockOrders);
      }
    } else {
      setOrders(mockOrders);
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleReorder = async (order) => {
    setReorderLoading(order.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add items to cart
    order.items.forEach(item => {
      const cartItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        foodItem: {
          id: item.name.toLowerCase().replace(/\s+/g, '-'),
          name: item.name,
          price: item.price,
          image: item.image || '/images/placeholder-food.jpg',
          description: '',
        },
        quantity: item.quantity,
        selectedProtein: item.options?.find(opt => 
          ['Fried Chicken', 'Grilled Fish', 'Beef', 'Smoked Chicken'].includes(opt)
        ) || '',
        selectedSides: item.options?.filter(opt => 
          !['Fried Chicken', 'Grilled Fish', 'Beef', 'Smoked Chicken'].includes(opt)
        ) || [],
        specialInstructions: '',
        totalPrice: item.price,
      };
      addToCart(cartItem);
    });
    
    setReorderLoading(null);
    showNotification(`Added ${order.items.length} items to cart!`);
    
    // Optional: Navigate to cart after short delay
    setTimeout(() => {
      navigate('/cart');
    }, 1500);
  };

  const handleTrackOrder = (order) => {
    navigate('/track-order', { state: { order } });
  };

  const handleRateOrder = (order) => {
    navigate('/rate-order', { state: { order } });
  };

  const handleContactSupport = () => {
    window.open('https://wa.me/2348012345678', '_blank');
  };

  const handleDownloadInvoice = (order) => {
    const invoiceContent = generateInvoice(order);
    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Invoice downloaded successfully!');
  };

  const generateInvoice = (order) => {
    return `
CHUKS KITCHEN - INVOICE
================================
Order ID: ${order.id}
Date: ${order.date} ${order.time}
Status: ${getStatusText(order.status).toUpperCase()}

ITEMS:
${order.items.map(item => `
${item.name}
Qty: ${item.quantity} x ₦${item.price.toLocaleString()} = ₦${(item.quantity * item.price).toLocaleString()}
${item.options?.length ? `Options: ${item.options.join(', ')}` : ''}
`).join('')}

--------------------------------
Subtotal:     ₦${order.subtotal.toLocaleString()}
Delivery:     ₦${order.deliveryFee.toLocaleString()}
Service Fee:  ₦${order.serviceFee.toLocaleString()}
${order.discount ? `Discount:    -₦${order.discount.toLocaleString()}` : ''}
--------------------------------
TOTAL:        ₦${order.total.toLocaleString()}
--------------------------------

Payment: ${order.paymentMethod.toUpperCase()}
${order.cardLast4 ? `Card ending in: ****${order.cardLast4}` : ''}

Delivery: ${order.deliveryMethod === 'delivery' ? order.deliveryAddress : 'Pickup at Restaurant'}

Thank you for choosing Chuks Kitchen!
`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Orders
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate('/menu')}
              className="hidden sm:flex"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Order Food
            </Button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-6">Start ordering delicious Nigerian food!</p>
              <Button
                onClick={() => navigate('/menu')}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {order.id}
                        </h3>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {order.date}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                      <p className="text-orange-600 font-bold mt-2">
                        ₦{order.total.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {order.status === 'out-for-delivery' && (
                        <Button
                          size="sm"
                          onClick={() => handleTrackOrder(order)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Truck className="w-4 h-4 mr-1" />
                          Track
                        </Button>
                      )}
                      
                      {order.status === 'delivered' && !order.rating && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRateOrder(order)}
                          className="text-orange-500 border-orange-200 hover:bg-orange-50"
                        >
                          Rate
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                      className="flex-1 sm:flex-none"
                    >
                      View Details
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(order)}
                      disabled={reorderLoading === order.id}
                      className="flex-1 sm:flex-none text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      {reorderLoading === order.id ? (
                        <>
                          <RotateCcw className="w-4 h-4 mr-1 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Reorder
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(order)}
                      className="hidden sm:flex"
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-orange-500 text-white p-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1 hover:bg-orange-600 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[70vh]">
              {/* Status Banner */}
              <div className={`p-4 ${getStatusColor(selectedOrder.status)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedOrder.status)}
                    <span className="font-medium">{getStatusText(selectedOrder.status)}</span>
                  </div>
                  <span className="text-sm opacity-75">{selectedOrder.date} at {selectedOrder.time}</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono font-medium text-lg">{selectedOrder.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-orange-600">₦{selectedOrder.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Items Ordered
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) => {
                            e.target.src = '/images/placeholder-food.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          {item.options?.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                              {item.options.join(', ')}
                            </p>
                          )}
                          <div className="flex justify-between mt-2">
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            <span className="font-medium">₦{(item.quantity * item.price).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₦{selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : `₦${selectedOrder.deliveryFee.toLocaleString()}`}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Service Fee</span>
                      <span>₦{selectedOrder.serviceFee.toLocaleString()}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₦{selectedOrder.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₦{selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedOrder.deliveryMethod === 'delivery' ? 'Delivery Address' : 'Pickup Details'}
                  </h4>
                  <p className="text-gray-600 text-sm">{selectedOrder.deliveryAddress}</p>
                  {selectedOrder.estimatedTime && (
                    <p className="text-sm text-gray-500 mt-2">
                      Estimated time: {selectedOrder.estimatedTime}
                      {selectedOrder.actualTime && ` • Delivered in ${selectedOrder.actualTime}`}
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Method
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium uppercase">
                      {selectedOrder.paymentMethod}
                    </span>
                    {selectedOrder.cardLast4 && (
                      <span className="text-sm text-gray-500">**** {selectedOrder.cardLast4}</span>
                    )}
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedOrder.specialInstructions && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Special Instructions</h4>
                    <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                      {selectedOrder.specialInstructions}
                    </p>
                  </div>
                )}

                {/* Restaurant Info */}
                <div className="border-t pt-4 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{selectedOrder.restaurant.name}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {selectedOrder.restaurant.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedOrder.restaurant.email}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                {selectedOrder.rating && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Your Rating</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < selectedOrder.rating ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 bg-gray-50 flex gap-2">
              <Button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleReorder(selectedOrder);
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reorder
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDownloadInvoice(selectedOrder)}
                className="flex-1"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default OrdersPage;