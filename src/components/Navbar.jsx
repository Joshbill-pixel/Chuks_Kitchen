import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Home, Compass, ClipboardList, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, getCartCount, getCartTotal, updateQuantity, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/menu', label: 'Explore', icon: Compass },
    { path: '/orders', label: 'My Orders', icon: ClipboardList },
    { path: '/account', label: 'Account', icon: User },
  ];

  const isAuthPage = location.pathname === '/' || location.pathname === '/signin' || location.pathname === '/signup';

  if (isAuthPage) {
    return (
      <nav className="w-full bg-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-script text-2xl sm:text-3xl text-orange-500">
            Chuks Kitchen
          </Link>
          <Link to="/signin">
            <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 rounded-full px-6">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex w-full items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="font-script text-2xl sm:text-3xl text-orange-500">
            Chuks Kitchen
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-20">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-orange-500'
                    : 'text-gray-700 hover:text-orange-500 hover:text-lg'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Sheet */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ShoppingCart className="w-5 h-5 text-gray-700" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {getCartCount()}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-left text-xl font-semibold">Your Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">Your cart is empty</p>
                      <Button
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate('/menu');
                        }}
                        className="mt-4 bg-orange-500 hover:bg-orange-600"
                      >
                        Browse Menu
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 p-5">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={item.foodItem.image}
                            alt={item.foodItem.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.foodItem.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.selectedProtein &&
                                `Protein: ${item.foodItem.proteinOptions?.find((p) => p.id === item.selectedProtein)?.name}`}
                              {item.selectedSides.length > 0 && (
                                <>, Sides: {item.selectedSides.map((s) => item.foodItem.sideOptions?.find((so) => so.id === s)?.name).join(', ')}</>
                              )}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-orange-500">
                                  ₦{item.totalPrice.toLocaleString()}
                                </span>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span className="text-orange-500">₦{getCartTotal().toLocaleString()}</span>
                        </div>
                        <Button
                          onClick={() => {
                            setIsCartOpen(false);
                            navigate('/cart');
                          }}
                          className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
                        >
                          View Cart & Checkout
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Login Button - Desktop */}
            <Link to="/signin" className="hidden md:block">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6">
                Login
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <Link
                to="/signin"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Login</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
