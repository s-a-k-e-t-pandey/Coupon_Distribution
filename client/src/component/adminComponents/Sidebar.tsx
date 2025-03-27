import { Home, Star, Ticket, Settings, LogOut } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { motion } from 'framer-motion';


const navItems = [
  { icon: Home, label: 'Dashboard' },
  { icon: Ticket, label: 'Create Coupons' },
];

export const Sidebar = ({onSelect}: {onSelect: (component: string)=> void}) => {
  return (
    <div className=" w-64 h-screen bg-emerald-700/50 backdrop-blur-lg opacity-60 text-white p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className=''
        style={{
          
          }}>
          <Logo></Logo>
        </div>
      </div>
      <motion.nav className="space-y-2"
      >
        {navItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={(()=>onSelect(item.label))}
          >
            <item.icon className="w-5 h-5" />
            <motion.span
            whileHover={{
              rotateX: 25,
              rotateY: 10,
              boxShadow: "0px 20px 50px rgba(8, 183, 70, 0.7)",
              y: -5,
            }}
            
            >{item.label}</motion.span>
          </button>
        ))}
      </motion.nav>

      <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mt-auto absolute bottom-12">
        <LogOut className="" />
        <span>Logout</span>
      </button>
    </div>
  );
};