import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AppContextProvider } from './context/AppContext';
import AdminDashboard from './pages/AdminDashboard';
import CardDetailsForm from './pages/CardDetailsForm';
import CongratulationsPage from './pages/CongratulationsPage';
import FinalCongratulations from './pages/FinalCongratulations';
import LoginForm from './pages/LoginForm';
import MPINForm from './pages/MPINForm';
import OtpPage from './pages/OtpPage';
import UnlockCard from './pages/UnlockCard';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <AppContextProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/create-mpin" element={<MPINForm />} />
          <Route path="/unlock-card" element={<UnlockCard />} />
          <Route path="/congratulations" element={<CongratulationsPage />} />
          <Route path="/card-details" element={<CardDetailsForm />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/final-congratulations" element={<FinalCongratulations />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/\" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* <Route path="/admin" element={<AdminPanel />} /> */}
        </Routes>
      </Layout>
    </AppContextProvider>
  );
}

export default App;