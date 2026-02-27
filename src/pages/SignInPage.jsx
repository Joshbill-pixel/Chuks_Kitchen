import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Footer } from '../components/Footer';

export function SignInPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 1) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, verify credentials against backend
      // For demo, we'll check against stored signup data or use mock
      const storedUser = localStorage.getItem('user');
      const mockUser = storedUser ? JSON.parse(storedUser) : null;
      
      // Simulate credential check (in real app, this is done server-side)
      if (mockUser && mockUser.email === formData.email) {
        // Create session
        const session = {
          user: mockUser,
          token: 'mock-jwt-token-' + Date.now(),
          expiresAt: Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000, // 30 days or 1 day
        };
        
        if (rememberMe) {
          localStorage.setItem('session', JSON.stringify(session));
        } else {
          sessionStorage.setItem('session', JSON.stringify(session));
        }
        
        navigate('/home');
      } else {
        // For demo purposes, allow any login
        const session = {
          user: { email: formData.email, name: 'User' },
          token: 'mock-jwt-token-' + Date.now(),
          expiresAt: Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000,
        };
        
        if (rememberMe) {
          localStorage.setItem('session', JSON.stringify(session));
        } else {
          sessionStorage.setItem('session', JSON.stringify(session));
        }
        
        navigate('/home');
      }
    } catch (error) {
      setErrors({ submit: 'Invalid email or password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Image with Overlay */}
        <div className="lg:w-1/2 relative hidden lg:block">
          <img
            src="/images/welcome-food.jpg"
            alt="Nigerian Food"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-orange-500/70 flex items-center justify-center">
            <div className="text-center text-white px-8">
              <h2 className="font-script text-4xl mb-4">Chuks Kitchen</h2>
              <p className="text-lg leading-relaxed">
                Your journey to delicious, authentic Nigerian meals starts here. Sign up or log in to order your favorites today!
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="font-script text-3xl text-orange-500 mb-2">Chuks Kitchen</h2>
              <h3 className="text-2xl font-semibold text-gray-900">Login to Your Account</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="name@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`pl-10 py-6 ${errors.email ? 'border-red-500' : ''}`}
                    
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className={`pl-10 pr-10 py-6 ${errors.password ? 'border-red-500' : ''}`}
                    
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-orange-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-base rounded-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-6 flex items-center justify-center gap-3"
                >
                  <img src="/images/google-icon.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-6 flex items-center justify-center gap-3"
                >
                  <img src="/images/apple-icon.svg" alt="Apple" className="w-5 h-5" />
                  Continue with Apple
                </Button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-orange-500 hover:underline font-medium">
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default SignInPage;