import { Home, Star, Ticket, Settings, LogOut } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard' },
];

export const Sidebar = () => {
  return (
    <div className=" w-64 h-screen bg-emerald-700/50 backdrop-blur-lg opacity-60 text-white p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className='flex flex-col rounded-lg'>
        <div className="text-xl font-bold text-4xl text-gray-600">the</div>
        <h1 className="text-4xl font-bold text-black mb-2">sales studio</h1>
        </div>
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

      <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mt-auto absolute bottom-12">
        <LogOut className="" />
        <span>Logout</span>
      </button>
    </div>
  );
};