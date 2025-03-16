import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const TopbarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(17, 24, 39, 0.85);
  backdrop-filter: blur(8px);
  z-index: 50;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  background: linear-gradient(to right, #c084fc, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export function Topbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/check-auth');
                const data = await response.json();
                setIsLoggedIn(data.isAuthenticated);
            } catch (error) {
                setIsLoggedIn(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = async () => {
        try {
            await fetch('/logout', { method: 'POST' });
            setIsLoggedIn(false);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <TopbarContainer>
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                <Logo className="flex items-center gap-2">
                    <div className="text-sm">the</div>
                    <div>sales studio</div>
                </Logo>

                <div>
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white 
                                     transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                            >
                                <path 
                                    fillRule="evenodd" 
                                    d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm11 4a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V7z" 
                                    clipRule="evenodd" 
                                />
                            </svg>
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="px-4 py-2 rounded-lg hover:bg-purple-700/10 text-white 
                                     transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                            >
                                <path 
                                    fillRule="evenodd" 
                                    d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 9a7 7 0 1 1 14 0H3z" 
                                    clipRule="evenodd" 
                                />
                            </svg>
                            Login
                        </button>
                    )}
                </div>
            </div>
        </TopbarContainer>
    );
}