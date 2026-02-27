import { useNavigate } from 'react-router-dom';
import { Plus, Minus, X, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
              <Button
                onClick={() => navigate('/menu')}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full sm:w-32 h-32 flex-shrink-0">
                      <img
                        src={item.foodItem.image}
                        alt={item.foodItem.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {item.foodItem.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.selectedProtein &&
                              `Protein: ${item.foodItem.proteinOptions?.find((p) => p.id === item.selectedProtein)?.name}`}
                            {item.selectedSides.length > 0 && (
                              <>, Sides: {item.selectedSides.map((s) => item.foodItem.sideOptions?.find((so) => so.id === s)?.name).join(', ')}</>
                            )}
                            {item.specialInstructions && (
                              <div className="mt-1 text-xs text-gray-400">
                                Note: {item.specialInstructions}
                              </div>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600 p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-100 rounded-sm flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-100 rounded-sm flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-xl font-bold text-orange-500">
                          ₦{item.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add More Items */}
              <button
                onClick={() => navigate('/menu')}
                className="flex items-center gap-2 text-orange-500 hover:underline py-4"
              >
                <Plus className="w-5 h-5" />
                Add more items from Chuks Kitchen
              </button>

              {/* Cart Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₦{getCartTotal().toLocaleString()}</span>
                </div>
                <Button
                  onClick={() => navigate('/order-summary')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-base rounded-lg"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CartPage;