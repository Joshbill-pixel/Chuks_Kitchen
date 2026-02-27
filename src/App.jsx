import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WelcomePage } from './pages/WelcomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { FoodDetailsPage } from './pages/FoodDetailsPage';
import { CartPage } from './pages/CartPage';
import { OrderSummaryPage } from './pages/OrderSummaryPage';
import { DeliveryDetailsPage } from './pages/DeliveryDetailsPage';
import { PaymentPage } from './pages/PaymentPage';
import { CardLoadingPage } from './pages/CardLoadingPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersPage } from './pages/OrdersPage';
import { AccountPage } from './pages/AccountPage';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/food/:id" element={<FoodDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-summary" element={<OrderSummaryPage />} />
          <Route path="/delivery-details" element={<DeliveryDetailsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/card-loading" element={<CardLoadingPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
