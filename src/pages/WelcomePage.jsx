import { Link } from 'react-router-dom';
import { Utensils, Truck, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Footer } from '../components/Footer';

export function WelcomePage() {
  // const features = [
  //   {
  //     icon: Utensils,
  //     title: 'Freshly Prepared',
  //   },
  //   {
  //     icon: Heart,
  //     title: 'Support Local Business',
  //   },
  //   {
  //     icon: Truck,
  //     title: 'Fast & Reliable Delivery',
  //   },
  // ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
          {/* Left Side - Image */}
          <div className="lg:w-1/2 relative">
            <img
              src="/images/welcome-food.jpg"
              alt="Nigerian Food"
              className="w-full h-64 lg:h-full object-cover"
            />
            {/* Mobile overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden" />
          </div>

          {/* Right Side - Content */}
          <div className="lg:w-1/2 mt-5 flex gap-20 flex-col justify-start align-center px-6 sm:px-12 lg:px-20 py-12 lg:py-0">
            {/* Navbar */}
            <nav className="w-full bg-white py-6 px-0 sm:px-0 lg:px-0">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="font-script text-2xl sm:text-3xl text-orange-500">
                  Chuks Kitchen
                </Link>
                <Link to="/signin">
                  <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-orange-500 rounded-lg px-6">
                    Sign In
                  </Button>
                </Link>
              </div>
            </nav>
            <div className="w-full ml-auto mr-auto flex-col justify-start align-center mt-20">
              <h1 className="text-3xl sm:text-4xl lg:text-4xl text-start font-bold text-gray-900 leading-tight">
                Your Authentic Taste of Nigeria
              </h1>
              <p className="mt-6 text-gray-600 text-base sm:text-lg leading-relaxed">
                Experience homemade flavors delivered fresh to your desk or home. We bring the rich culinary heritage of Nigeria right to your doorstep.
              </p>

              {/* Features */}
              {/* <div className="mt-8 space-y-4 lg:grid lg:grid-cols-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature.title}</span>
                  </div>
                ))}
              </div> */}
              <div className="space-y-4 mt-8 lg:grid lg:grid-cols-2 lg:gap-x-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Utensils className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-gray-900 font-medium text-base lg:text-md">
                    Freshly Prepared
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Utensils className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-gray-900 font-medium text-base lg:text-md">
                    Support Local Business
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-gray-900 font-medium text-base lg:text-md">
                    Fast & Reliable Delivery
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-10 space-y-6 flex flex-col">
                <Link to="/signin">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-base rounded-lg">
                    Start Your Order
                  </Button>
                </Link>
                <Link to="/home">
                  <Button
                    variant="outline"
                    className="w-full border-blue-500 text-blue-500 hover:bg-orange-500 py-6 text-base rounded-lg"
                  >
                    Learn More About Us
                  </Button>
                </Link>
              </div>

              <div className="mt-20 pt-8  flex flex-col md:flex-row items-end justify-center gap-6">
                <p className="text-gray-800 text-md text-center md:text-left">
                  © 2024 Chuks Kitchen.
                </p>
                <div className="flex gap-3">
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-md">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-md">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default WelcomePage;