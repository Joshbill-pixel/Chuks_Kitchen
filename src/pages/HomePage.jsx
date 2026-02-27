import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { categories, foodItems } from '../data/foodData';
import { useCart } from '../context/CartContext';

export function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const chefSpecials = foodItems.slice(0, 6);

  const handleAddToCart = (foodItem) => {
    const cartItem = {
      id: `${foodItem.id}-${Date.now()}`,
      foodItem,
      quantity: 1,
      selectedProtein: foodItem.proteinOptions?.find((p) => p.default)?.id,
      selectedSides: [],
      specialInstructions: '',
      totalPrice: foodItem.price,
    };
    addToCart(cartItem);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative lg:h-[941px] sm:h-[800px] h-[600px]">
          <img
            src="/images/hero-banner.jpg"
            alt="Nigerian Food Spread"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 top-[-50px]">
            <div className="max-w-5xl">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight">
                The Heart of Nigerian Home Cooking
              </h1>
              <p className="mt-4 text-lg text-white/100">
                Handcrafted with passion, delivered with care.
              </p>
              <Button
                onClick={() => navigate('/menu')}
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-lg"
              >
                Discover what's new
              </Button>
            </div>
          </div>

          {/* Search Section */}
          <div className="absolute lg:w-[900px] h-[60px] mx-auto my-auto lg:top-[117vh] w-[350px] top-[71vh] sm:top-[96vh] sm:w-[450px] left-0 right-0">
            <div className="relative ">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="What are you craving for today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 h-[60px] bg-white-300 text-base border-gray-200 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-12 mt-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10">
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/menu?category=${category.name}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Chef's Specials */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10">
              Chef's Specials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {chefSpecials.map((food) => (
                <div
                  key={food.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border"
                >
                  <div className="aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => navigate(`/food/${food.id}`)}>
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3
                      className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-orange-500"
                      onClick={() => navigate(`/food/${food.id}`)}
                    >
                      {food.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {food.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg font-bold text-orange-500">
                        ₦{food.price.toLocaleString()}
                      </span>
                      <Button
                        onClick={() => handleAddToCart(food)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New Menu Banner */}
        <section className="relative h-[600px] sm:h-[600px]">
          <img
            src="/images/New_menu_banner.png"
            alt="New Menu"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Introducing Our New Menu Additions!
              </h2>
              <p className="mt-4 text-white/90">
                Explore exciting new dishes, crafted with the freshest ingredients and authentic Nigerian flavors. Limited time offer!
              </p>
              <Button
                onClick={() => navigate('/menu')}
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-lg"
              >
                Discover what's new
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;