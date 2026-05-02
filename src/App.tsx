import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ChatInterface } from './components/ChatInterface';
import { CreditPanel } from './components/CreditPanel';
import { InstallWizard } from './components/InstallWizard';
import { AdminPanel } from './components/AdminPanel';
import { Login, Register } from './components/Auth';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { MessageSquare, CreditCard, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';

function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const menuItems = [
    { icon: MessageSquare, label: t('chat'), path: '/' },
    { icon: CreditCard, label: t('buy_credits'), path: '/credits' },
    { icon: LayoutDashboard, label: t('admin'), path: '/admin' },
    { icon: Settings, label: t('install'), path: '/install' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    window.location.reload();
  };

  return (
    <div className="w-64 bg-zinc-50 border-r border-zinc-200 flex flex-col h-screen shrink-0 hidden md:flex">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">C</div>
            <span className="font-bold text-xl tracking-tight text-zinc-900">CroopsAI</span>
          </div>
          <LanguageSwitcher />
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white text-primary border border-zinc-200 shadow-sm' 
                    : 'text-zinc-600 hover:bg-white hover:text-zinc-900 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : 'text-zinc-400'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-zinc-200">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-white hover:text-red-500 transition-all w-full text-left border border-transparent hover:border-zinc-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const userId = localStorage.getItem('user_id');

  return (
    <BrowserRouter>
      <div className="flex bg-white min-h-screen text-zinc-900 selection:bg-primary/20 selection:text-primary">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/install" element={<InstallWizard />} />
          <Route path="*" element={
            !userId ? <Login /> : (
              <>
                <Sidebar />
                <main className="flex-1 overflow-hidden h-screen bg-white">
                  <Routes>
                    <Route path="/" element={<ChatInterface />} />
                    <Route path="/credits" element={<CreditPanel />} />
                    <Route path="/admin" element={<AdminPanel />} />
                  </Routes>
                </main>
              </>
            )
          } />
        </Routes>
        <Toaster theme="light" position="top-right" />
      </div>
    </BrowserRouter>
  );
}
