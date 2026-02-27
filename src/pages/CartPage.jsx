import { useNavigate } from 'react-router-dom';
import { Plus, Minus, X, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [animatingId, setAnimatingId] = useState(null);

  const handleQuantityChange = (id, newQty) => {
    setAnimatingId(id);
    updateQuantity(id, newQty);

    setTimeout(() => {
      setAnimatingId(null);
    }, 180);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-black mb-10">
            Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added any items yet.
              </p>
              <Button
                onClick={() => navigate('/menu')}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-6">

              {/* CART ITEMS */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 transition-shadow hover:shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

                    {/* LEFT SIDE */}
                    <div className="flex items-start sm:items-center gap-5">
                      
                      {/* Image */}
                      <div className="w-28 h-24 sm:w-40 sm:h-28 flex-shrink-0">
                        <img
                          src={item.foodItem.image}
                          alt={item.foodItem.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Details */}
                      <div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-black">
                          {item.foodItem.name}
                        </h3>

                        <p className="text-gray-500 mt-2 text-sm sm:text-base leading-relaxed">
                          {item.selectedProtein &&
                            `With ${
                              item.foodItem.proteinOptions?.find(
                                (p) => p.id === item.selectedProtein
                              )?.name
                            }`}
                          {item.selectedSides.length > 0 &&
                            `, ${item.selectedSides
                              .map(
                                (s) =>
                                  item.foodItem.sideOptions?.find(
                                    (so) => so.id === s
                                  )?.name
                              )
                              .join(', ')}`}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="w-9 h-9 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-all duration-150"
                        >
                          <Minus className="w-4 h-4 text-black" />
                        </button>

                        <span
                          className={`text-2xl font-medium text-black w-6 text-center transition-transform duration-150 ${
                            animatingId === item.id ? 'scale-125' : 'scale-100'
                          }`}
                        >
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="w-9 h-9 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-all duration-150"
                        >
                          <Plus className="w-4 h-4 text-black" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-xl sm:text-2xl font-bold text-orange-500 min-w-[100px] text-right">
                        ₦{item.totalPrice.toLocaleString()}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-9 h-9 bg-orange-500 hover:bg-orange-600 rounded-md flex items-center justify-center transition-all duration-150"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add More Items */}
              <button
                onClick={() => navigate('/menu')}
                className="flex items-center gap-2 text-blue-500 hover:underline pt-3 text-sm sm:text-base"
              >
                <Plus className="w-5 h-5" />
                Add more items from Chuks Kitchen
              </button>

              {/* Summary */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mt-6">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-gray-600 text-base">
                    Subtotal
                  </span>
                  <span className="text-lg sm:text-xl font-semibold text-black">
                    ₦{getCartTotal().toLocaleString()}
                  </span>
                </div>

                <Button
                  onClick={() => navigate('/order-summary')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-base rounded-lg transition-all duration-200"
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