import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Flame, Leaf, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";
import { Textarea } from "../components/ui/textarea";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { foodItems } from "../data/foodData";
import { useCart } from "../context/CartContext";

export function FoodDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // ✅ FIXED: Safe ID matching (handles string/number mismatch)
  const food = useMemo(() => {
    if (!id) return null;
    return foodItems.find(
      (item) => String(item.id) === String(id)
    );
  }, [id]);

  const [selectedProtein, setSelectedProtein] = useState(
    food?.proteinOptions?.find((p) => p.default)?.id || ""
  );
  const [selectedSides, setSelectedSides] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  if (!food) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Food item not found
            </h1>
            <Button
              onClick={() => navigate("/menu")}
              className="mt-4 bg-orange-500 text-white"
            >
              Back to Menu
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const calculateTotal = () => {
    let total = food.price;

    const protein = food.proteinOptions?.find(
      (p) => p.id === selectedProtein
    );
    if (protein) total += protein.price;

    selectedSides.forEach((sideId) => {
      const side = food.sideOptions?.find(
        (s) => s.id === sideId
      );
      if (side) total += side.price;
    });

    return total;
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: `${food.id}-${Date.now()}`,
      foodItem: food,
      quantity: 1,
      selectedProtein,
      selectedSides,
      specialInstructions,
      totalPrice: calculateTotal(),
    };

    addToCart(cartItem);
    navigate("/cart");
  };

  const toggleSide = (sideId) => {
    setSelectedSides((prev) =>
      prev.includes(sideId)
        ? prev.filter((s) => s !== sideId)
        : [...prev, sideId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Image Section */}
              <div className="relative h-72 sm:h-96 lg:h-auto">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details Section */}
              <div className="bg-gray-100 p-10 relative">
                
                {/* Close Button */}
                <button
                  onClick={() => navigate("/menu")}
                  className="absolute top-6 right-6 w-9 h-9 bg-black rounded-md flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900">
                  {food.name}
                </h1>

                {/* Price */}
                <p className="text-2xl font-semibold text-orange-500 mt-3">
                  ₦{calculateTotal().toLocaleString()}
                </p>

                {/* Description */}
                <p className="text-gray-700 mt-6 leading-relaxed max-w-2xl">
                  {food.description}
                </p>

                {/* Tags */}
                {food.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-8 mt-6 text-gray-600 text-sm">
                    {food.tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {tag.toLowerCase().includes("spicy") && (
                          <Flame className="w-4 h-4 text-orange-500" />
                        )}
                        {tag.toLowerCase().includes("vegetarian") && (
                          <Leaf className="w-4 h-4 text-green-500" />
                        )}
                        <span>{tag}</span>
                      </div>
                    ))}
                    <button className="flex items-center gap-2 text-orange-500">
                      <AlertCircle className="w-4 h-4" />
                      View Allergies
                    </button>
                  </div>
                )}

                {/* Protein Options */}
                {food.proteinOptions?.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                      Choose Your Protein
                    </h3>

                    <RadioGroup
                      value={selectedProtein}
                      onValueChange={setSelectedProtein}
                      className="space-y-4"
                    >
                      {food.proteinOptions.map((protein) => (
                        <label
                          key={protein.id}
                          className={`flex items-center justify-between p-5 border rounded-xl cursor-pointer transition ${
                            selectedProtein === protein.id
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <RadioGroupItem
                              value={protein.id}
                              id={protein.id}
                            />
                            <span className="text-gray-800">
                              {protein.name}
                            </span>
                          </div>

                          <span className="text-gray-700">
                            {protein.price === 0
                              ? "(Default)"
                              : `+₦${protein.price.toLocaleString()}`}
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Extra Sides */}
                {food.sideOptions?.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                      Extra Sides (Optional)
                    </h3>

                    <div className="space-y-4">
                      {food.sideOptions.map((side) => (
                        <label
                          key={side.id}
                          className={`flex items-center justify-between p-5 border rounded-xl cursor-pointer transition ${
                            selectedSides.includes(side.id)
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={selectedSides.includes(side.id)}
                              onCheckedChange={() =>
                                toggleSide(side.id)
                              }
                            />
                            <span className="text-gray-800">
                              {side.name}
                            </span>
                          </div>

                          <span className="text-gray-700">
                            +₦{side.price.toLocaleString()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div className="mt-12">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    Special Instructions
                  </h3>

                  <Textarea
                    placeholder="E.g no onion, less pepper, not too hot..."
                    value={specialInstructions}
                    onChange={(e) =>
                      setSpecialInstructions(e.target.value)
                    }
                    className="min-h-[120px] rounded-xl border-gray-300"
                  />
                </div>

                {/* Add to Cart */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full mt-12 bg-orange-500 hover:bg-orange-600 text-white py-6 text-base rounded-xl"
                >
                  Add to Cart - ₦{calculateTotal().toLocaleString()}
                </Button>

              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FoodDetailsPage;