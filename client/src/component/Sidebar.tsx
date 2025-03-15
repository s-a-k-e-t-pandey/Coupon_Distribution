import { Home, Star, Ticket, Settings, LogOut } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard' },
  { icon: Ticket, label: 'Coupons' },
  { icon: Settings, label: 'Settings' }
];

export const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-6">
      <div className="flex items-center gap-3 mb-8">
        <Star className="w-8 h-8 text-purple-400" />
        <h1 className="text-xl font-bold">StarAdmin</h1>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mt-auto absolute bottom-6">
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};