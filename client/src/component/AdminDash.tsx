import { StarBackground } from './ui/StarBackground';
import { Sidebar } from './adminComponents/Sidebar';
import styled from 'styled-components';
import { CreateCoupon } from './adminComponents/CreateCoupon';
import { motion } from 'framer-motion';

interface BackgroundImageProps {
  $backgroundImage: string;
  $isDayTime: boolean;
}

const BackgroundImage = styled.div<BackgroundImageProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  opacity: ${props => props.$isDayTime ? 0 : 1};
  transition: opacity ${props => props.$isDayTime ? '12s' : '5s'} ease-in-out;
`;

function AdminDash() {
  
  
    return (
      <div className="flex min-w-screen min-h-screen bg-black"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(220, 236, 239, 0.2) 0.5px, transparent 0)`,
        backgroundSize: "8px 8px",
        backgroundRepeat: "repeat",
      }} 
      >
        <StarBackground />
        <div className='relative'><Sidebar /></div>
        
        <main className="flex-1 p-8">

          <motion.div className="h-48 mb-8 rounded-xl bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80")'}}
          whileHover={{
            translateX: 10
            
          }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-transparent">
              <div className="p-8">
                <h1 className="text-4xl font-bold text-white mb-2">Welcome Back, Admin_Name</h1>
                <p className="text-purple-200">Monitor and track the coupon management</p>
              </div>
            </div>
          </motion.div>
          <div className="">
              <CreateCoupon></CreateCoupon>
          </div>
        </main>
      </div>
    );
}

export default AdminDash;