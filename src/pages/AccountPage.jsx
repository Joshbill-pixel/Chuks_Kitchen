import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Lock, LogOut, ChevronRight, 
  Shield, Edit2, Trash2, AlertTriangle, Loader2, X, Camera,
  CheckCircle, Bell, CreditCard, Heart, FileText
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function AccountPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [notification, setNotification] = useState(null);
  
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 801 234 5678',
    address: '123 Main Street, Victoria Island, Lagos',
    twoFactorEnabled: false,
    loginHistory: [],
    profileImage: null,
  });

  // Check authentication on mount
  useEffect(() => {
    const session = localStorage.getItem('session') || sessionStorage.getItem('session');
    if (!session) {
      navigate('/signin');
      return;
    }
    
    try {
      const sessionData = JSON.parse(session);
      if (Date.now() > sessionData.expiresAt) {
        handleLogout();
        return;
      }
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUserData(prev => ({ ...prev, ...JSON.parse(storedUser) }));
      }
    } catch (e) {
      handleLogout();
    }
  }, [navigate]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 2000);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('user', JSON.stringify(userData));
      setIsEditing(false);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      showNotification('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('session');
    sessionStorage.removeItem('session');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      localStorage.clear();
      sessionStorage.clear();
      navigate('/signup');
    } catch (error) {
      showNotification('Failed to delete account. Please contact support.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('Please select an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image must be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSave = async () => {
    if (!previewImage) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserData(prev => ({ ...prev, profileImage: previewImage }));
      localStorage.setItem('user', JSON.stringify({ ...userData, profileImage: previewImage }));
      setShowImageModal(false);
      setPreviewImage(null);
      showSuccess('Profile picture updated!');
    } catch (error) {
      showNotification('Failed to update profile picture', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setUserData(prev => ({ ...prev, profileImage: null }));
    localStorage.setItem('user', JSON.stringify({ ...userData, profileImage: null }));
    setShowImageModal(false);
    setPreviewImage(null);
    showSuccess('Profile picture removed');
  };

  const menuItems = [
    { 
      icon: User, 
      label: 'Personal Information', 
      action: () => setIsEditing(true),
      description: 'Update your name, phone, and address'
    },
    { 
      icon: MapPin, 
      label: 'Saved Addresses', 
      action: () => navigate('/delivery-details'),
      description: 'Manage delivery addresses'
    },
    { 
      icon: CreditCard, 
      label: 'Payment Methods', 
      action: () => navigate('/payment'),
      description: 'Manage cards and wallets'
    },
    { 
      icon: FileText, 
      label: 'Order History', 
      action: () => navigate('/orders'),
      description: 'View past orders'
    },
  ];

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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            My Account
          </h1>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center relative overflow-hidden group cursor-pointer"
                style={{ backgroundColor: userData.profileImage ? 'transparent' : '#ffedd5' }}
                onClick={handleImageClick}
              >
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-orange-500" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
                <p className="text-gray-500">{userData.email}</p>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={userData.email}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <Input
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <Input
                    value={userData.address}
                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={handleSave} 
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{userData.address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <span className="block text-gray-900 font-medium">{item.label}</span>
                    <span className="text-xs text-gray-500">{item.description}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-xl border border-red-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </h3>
            
            {!showDeleteConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-100"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-red-800">
                  Are you sure? This action cannot be undone. All your data will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Delete My Account'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </main>

      {/* Profile Picture Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-lg">Profile Picture</h3>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setPreviewImage(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Preview Area */}
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 mb-6 flex items-center justify-center">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : userData.profileImage ? (
                  <img src={userData.profileImage} alt="Current" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {previewImage ? 'Choose Different Photo' : 'Upload Photo'}
                </Button>
                
                {previewImage && (
                  <Button
                    onClick={handleImageSave}
                    disabled={isLoading}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Save Photo
                  </Button>
                )}
                
                {userData.profileImage && !previewImage && (
                  <Button
                    onClick={handleRemoveImage}
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Photo
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowImageModal(false);
                    setPreviewImage(null);
                  }}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Supported: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600">{successMessage}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AccountPage;