import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { foodItems, categories } from '../data/foodData';
import { useCart } from '../context/CartContext';

export function MenuPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'Popular'
  );

  const allCategories = ['Popular', ...categories.map((c) => c.name)];

  // Sync category to URL
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Popular') {
      return foodItems.slice(0, 6);
    }
    return foodItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleAddToCart = (e, foodItem) => {
    e.stopPropagation(); // Prevent navigation

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

  const FoodCard = ({ food }) => (
    <div
      onClick={() => navigate(`/food/${food.id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 group"
    >
      {/* Image */}
      <div className="h-56 w-full overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between min-h-[170px]">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            {food.name}
          </h4>

          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {food.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-6">
          <span className="text-orange-500 font-semibold">
            ₦{food.price.toLocaleString()}
          </span>

          <button
            onClick={(e) => handleAddToCart(e, food)}
            className="w-9 h-9 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        {/* Hero Banner */}
        <div className="relative h-[750px]">
          <img
            src="/images/menu-banner.jpg"
            alt="Menu Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 px-[60px] flex flex-col justify-center items-start">
            <h1 className="text-5xl font-bold text-white mt-40">
              Chuks Kitchen
            </h1>
            <p className="mt-2 text-white/90">
              Nigerian Home Cooking 4.8 (1.2k)
            </p>
          </div>
        </div>

        <div className="bg-gray-100 px-6 lg:px-10 py-20">
          {/* Menu Categories */}
          <div className="mb-12">
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                Menu Categories
              </h2>

              <div className="flex flex-col">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`text-left px-4 py-3 text-lg transition-all ${
                      selectedCategory === category
                        ? "bg-[#E8CFAF] border-l-4 border-orange-500 font-semibold"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Sections */}
          <div className="space-y-16">
            {/* Selected Category */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                {selectedCategory}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>
            </div>

            {/* Other Categories (Only when Popular) */}
            {selectedCategory === "Popular" &&
              categories.map((category) => {
                const categoryItems = foodItems.filter(
                  (item) => item.category === category.name
                );

                if (!categoryItems.length) return null;

                return (
                  <div key={category.id}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-8">
                      {category.name}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryItems.slice(0, 3).map((food) => (
                        <FoodCard key={food.id} food={food} />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MenuPage;