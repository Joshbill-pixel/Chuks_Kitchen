import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Phone, X, Plus, Home, Briefcase, Navigation, Check, Loader2, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

// Mock saved addresses
const SAVED_ADDRESSES = [
  {
    id: 'home',
    type: 'home',
    label: 'Home',
    address: '123 Main Street, Victoria Island, Lagos',
    details: 'Apt 4B, Opposite Mega Plaza',
    isDefault: true,
  },
  {
    id: 'work',
    type: 'work',
    label: 'Work',
    address: '45 Adeola Odeku Street, Victoria Island, Lagos',
    details: '3rd Floor, Sterling Towers',
    isDefault: false,
  },
];

// Generate available time slots
const generateTimeSlots = () => {
  const slots = [];
  const now = new Date();
  const currentHour = now.getHours();
  
  // Generate slots from current time + 1 hour to 10 PM
  for (let hour = Math.max(currentHour + 1, 8); hour < 22; hour++) {
    for (let minute of [0, 30]) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const label = hour < 12 
        ? `${time} AM` 
        : hour === 12 
          ? `${time} PM` 
          : `${(hour - 12).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} PM`;
      slots.push({ value: time, label });
    }
  }
  return slots;
};

// Generate next 7 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      value: date.toISOString().split('T')[0],
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[date.getDay()],
      date: `${months[date.getMonth()]} ${date.getDate()}`,
      fullDate: date,
    });
  }
  return dates;
};

export function DeliveryDetailsPage() {
  const navigate = useNavigate();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const [addresses, setAddresses] = useState(SAVED_ADDRESSES);
  const [formData, setFormData] = useState({
    deliveryTime: 'ASAP(30-25)',
    scheduledDate: null,
    scheduledTime: null,
    instructions: '',
    contactPhone: '+234 801 234 5678',
  });

  const [newAddress, setNewAddress] = useState({
    type: 'home',
    label: '',
    address: '',
    details: '',
  });

  const [scheduleSelection, setScheduleSelection] = useState({
    date: generateDates()[0].value,
    time: generateTimeSlots()[0]?.value || '12:00',
  });

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];
  const timeSlots = generateTimeSlots();
  const availableDates = generateDates();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setShowAddressModal(false);
    showNotification('Delivery address updated');
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newId = `addr-${Date.now()}`;
    const addressToAdd = {
      id: newId,
      type: newAddress.type,
      label: newAddress.label || (newAddress.type === 'home' ? 'Home' : newAddress.type === 'work' ? 'Work' : 'Other'),
      address: newAddress.address,
      details: newAddress.details,
      isDefault: false,
    };
    
    setAddresses([...addresses, addressToAdd]);
    setSelectedAddressId(newId);
    setShowAddNewModal(false);
    setShowAddressModal(false);
    setNewAddress({ type: 'home', label: '', address: '', details: '' });
    setIsLoading(false);
    showNotification('New address added successfully');
  };

  const handleDeleteAddress = (addressId) => {
    if (addresses.length <= 1) {
      showNotification('You must have at least one address', 'error');
      return;
    }
    setAddresses(addresses.filter(a => a.id !== addressId));
    if (selectedAddressId === addressId) {
      setSelectedAddressId(addresses.find(a => a.id !== addressId)?.id);
    }
    showNotification('Address removed');
  };

  const handleSetDefault = (addressId) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === addressId
    })));
    showNotification('Default address updated');
  };

  const handleScheduleSelect = () => {
    const selectedDate = availableDates.find(d => d.value === scheduleSelection.date);
    const selectedTime = timeSlots.find(t => t.value === scheduleSelection.time);
    
    setFormData({
      ...formData,
      deliveryTime: 'schedule',
      scheduledDate: scheduleSelection.date,
      scheduledTime: scheduleSelection.time,
    });
    
    setShowScheduleModal(false);
    showNotification(`Delivery scheduled for ${selectedDate.day}, ${selectedDate.date} at ${selectedTime.label}`);
  };

  const getDeliveryTimeLabel = () => {
    if (formData.deliveryTime === 'schedule' && formData.scheduledDate && formData.scheduledTime) {
      const date = availableDates.find(d => d.value === formData.scheduledDate);
      const time = timeSlots.find(t => t.value === formData.scheduledTime);
      return `${date.day}, ${date.date} at ${time?.label || formData.scheduledTime}`;
    }
    if (formData.deliveryTime === 'ASAP(30-25)') return 'ASAP (30-25 mins)';
    if (formData.deliveryTime === 'ASAP(45-30)') return 'Standard (45-30 mins)';
    return 'Select time';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const deliveryDetails = {
      address: selectedAddress,
      ...formData,
    };
    localStorage.setItem('deliveryDetails', JSON.stringify(deliveryDetails));
    
    navigate('/payment');
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'home': return <Home className="w-5 h-5" />;
      case 'work': return <Briefcase className="w-5 h-5" />;
      default: return <Navigation className="w-5 h-5" />;
    }
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Delivery Details
            </h1>

            {/* Address */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Delivery Address
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(true)}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
                >
                  Change Address
                </button>
              </div>
              
              <div className="border-2 border-orange-100 rounded-lg p-4 bg-orange-50/50 relative">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    {getAddressIcon(selectedAddress.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{selectedAddress.label}</span>
                      {selectedAddress.isDefault && (
                        <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700">{selectedAddress.address}</p>
                    {selectedAddress.details && (
                      <p className="text-sm text-gray-500 mt-1">{selectedAddress.details}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Time */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Delivery Time
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'ASAP(30-25)', label: 'ASAP', sublabel: '30-25 mins' },
                  { value: 'ASAP(45-30)', label: 'Standard', sublabel: '45-30 mins' },
                  { value: 'schedule', label: 'Schedule', sublabel: getDeliveryTimeLabel() === 'Select time' ? 'Pick a time' : getDeliveryTimeLabel() },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      if (option.value === 'schedule') {
                        setShowScheduleModal(true);
                      } else {
                        setFormData({ 
                          ...formData, 
                          deliveryTime: option.value,
                          scheduledDate: null,
                          scheduledTime: null,
                        });
                      }
                    }}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      formData.deliveryTime === option.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-200'
                    }`}
                  >
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-500 truncate">{option.sublabel}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Delivery Instructions (Optional)
              </label>
              <Textarea
                placeholder="E.g leave at the front of the door, knock twice, call when you arrive..."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            {/* Contact Phone */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Phone
              </label>
              <Input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="py-3"
              />
              <p className="text-xs text-gray-500 mt-1">Rider will call this number on arrival</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-base rounded-lg"
            >
              Continue to Payment
            </Button>
          </form>
        </div>
      </main>

      {/* Schedule Time Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-orange-500 text-white">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Delivery
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1 hover:bg-orange-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {availableDates.map((date) => (
                    <button
                      key={date.value}
                      onClick={() => setScheduleSelection({ ...scheduleSelection, date: date.value })}
                      className={`flex-shrink-0 p-3 rounded-lg border-2 min-w-[80px] text-center transition-all ${
                        scheduleSelection.date === date.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <p className="text-xs text-gray-500 uppercase">{date.day}</p>
                      <p className="font-semibold text-gray-900">{date.date.split(' ')[1]}</p>
                      <p className="text-xs text-gray-400">{date.date.split(' ')[0]}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      onClick={() => setScheduleSelection({ ...scheduleSelection, time: slot.value })}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        scheduleSelection.time === slot.value
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-orange-200 text-gray-700'
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Selected:</p>
                <p className="font-semibold text-gray-900">
                  {availableDates.find(d => d.value === scheduleSelection.date)?.day}, {' '}
                  {availableDates.find(d => d.value === scheduleSelection.date)?.date} at {' '}
                  {timeSlots.find(t => t.value === scheduleSelection.time)?.label}
                </p>
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowScheduleModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleScheduleSelect}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                Confirm Schedule
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-lg">Select Delivery Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => handleAddressSelect(address.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative group ${
                    selectedAddressId === address.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedAddressId === address.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getAddressIcon(address.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{address.label}</span>
                        {address.isDefault && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                        {selectedAddressId === address.id && (
                          <Check className="w-4 h-4 text-orange-500 ml-auto" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{address.address}</p>
                      {address.details && (
                        <p className="text-xs text-gray-500 mt-1">{address.details}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    {!address.isDefault && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(address.id);
                        }}
                        className="text-xs text-orange-500 hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address.id);
                      }}
                      className="text-xs text-red-500 hover:underline ml-auto"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t bg-gray-50">
              <Button
                type="button"
                onClick={() => setShowAddNewModal(true)}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Address Modal */}
      {showAddNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-semibold text-lg">Add New Address</h3>
              <button
                onClick={() => setShowAddNewModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddNewAddress} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Type
                </label>
                <div className="flex gap-3">
                  {[
                    { type: 'home', icon: Home, label: 'Home' },
                    { type: 'work', icon: Briefcase, label: 'Work' },
                    { type: 'other', icon: Navigation, label: 'Other' },
                  ].map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddress({ ...newAddress, type, label: type === 'other' ? '' : label })}
                      className={`flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                        newAddress.type === type
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {newAddress.type === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Label
                  </label>
                  <Input
                    placeholder="e.g. Gym, Parents' House"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <Textarea
                  placeholder="Enter your full address"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  required
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apartment, Suite, etc. (Optional)
                </label>
                <Input
                  placeholder="e.g. Apt 4B, 3rd Floor"
                  value={newAddress.details}
                  onChange={(e) => setNewAddress({ ...newAddress, details: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddNewModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Address'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default DeliveryDetailsPage;