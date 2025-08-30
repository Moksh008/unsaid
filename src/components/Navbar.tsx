
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, User, LogOut, Shield, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isLoading, userRole, isAdmin, isMentor, isMentee, dashboardUrl } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent background scrolling when menu is open
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  const getDashboardLabel = () => {
    if (isAdmin) return 'Admin Dashboard';
    if (isMentor) return 'Mentor Dashboard';
    if (isMentee) return 'Mentee Dashboard';
    return 'Dashboard';
  };

  const getDashboardIcon = () => {
    if (isAdmin) return Shield;
    if (isMentor) return Users;
    return User;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-2 sm:py-3 md:py-4 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <a 
          href="#" 
          className="flex items-center space-x-2"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          aria-label="Pulse Robot"
        >
          <img 
            src="/logo.svg" 
            alt="Pulse Robot Logo" 
            className="h-7 sm:h-8" 
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
          >
            Home
          </a>
          <a href="#features" className="nav-link">About</a>
          <a href="#details" className="nav-link">Contact</a>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {!isLoading ? (
            <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : isAuthenticated ? (
            <>
              <a 
                href={dashboardUrl}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(dashboardUrl);
                }}
              >
                {(() => {
                  const Icon = getDashboardIcon();
                  return <Icon className="h-4 w-4" />;
                })()}
                <span>{getDashboardLabel()}</span>
              </a>
              <button 
                onClick={() => logout()}
                className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/signin')}
                className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-blue-600 text-white hover:bg-blue-700 font-medium px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button - increased touch target */}
        <button 
          className="md:hidden text-gray-700 p-3 focus:outline-none" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation - improved for better touch experience */}
      <div className={cn(
        "fixed inset-0 z-40 bg-white flex flex-col pt-16 px-6 md:hidden transition-all duration-300 ease-in-out",
        isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      )}>
        <nav className="flex flex-col space-y-8 items-center mt-8">
          <a 
            href="#" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Home
          </a>
          <a 
            href="#features" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            About
          </a>
          <a 
            href="#details" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Contact
          </a>
        </nav>

        {/* Mobile Auth Buttons */}
        <div className="flex flex-col space-y-4 items-center mt-8">
          {!isLoading ? (
            <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : isAuthenticated ? (
            <>
              <a 
                href={dashboardUrl}
                className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(dashboardUrl);
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
              >
                <div className="flex items-center justify-center space-x-2">
                  {(() => {
                    const Icon = getDashboardIcon();
                    return <Icon className="h-5 w-5" />;
                  })()}
                  <span>{getDashboardLabel()}</span>
                </div>
              </a>
              <button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
                className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <div className="flex items-center justify-center space-x-2">
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </div>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => {
                  navigate('/signin');
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
                className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  navigate('/signup');
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
                className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
