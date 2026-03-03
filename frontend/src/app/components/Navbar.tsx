'use client';

import Link from 'next/link';
import { Gamepad2, Search, User, Bell, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-card px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Gamepad2 className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
          <span className="text-2xl font-bold tracking-tighter text-gradient">GAMETIFY</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link href="/games" className="hover:text-white transition-colors">Games</Link>
          <Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link>
          <Link href="/lists" className="hover:text-white transition-colors">Lists</Link>
          <Link href="/members" className="hover:text-white transition-colors">Community</Link>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-48 lg:w-64 transition-all"
            />
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-white/60 hover:text-white cursor-pointer transition-colors" />
              <Link href="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="text-xs font-bold text-white/70 group-hover:text-white hidden lg:block">{user.username}</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-white/40 group-hover:text-red-400" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-xs font-bold text-white/60 hover:text-white tracking-widest uppercase">Login</Link>
              <Link href="/register" className="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-lg shadow-primary/20">
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
