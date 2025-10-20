import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import logo from "@/assets/logo.png";

interface NavigationProps {
  onSecretClick?: () => void;
}

export const Navigation = ({ onSecretClick }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/store", label: "Store" },
    { path: "/payment", label: "Payment" },
    { path: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden shadow-glow transition-transform duration-300 group-hover:scale-110">
              <img src={logo} alt="TehTehAir Store Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg sm:text-xl font-bold gradient-text hidden sm:block">TehTehAir Store</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  className={`transition-all duration-300 ${
                    isActive(link.path) ? "glow" : "hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  className={`w-full justify-start transition-all duration-300 ${
                    isActive(link.path) ? "glow" : "hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Hidden payment logo for secret admin access */}
      {onSecretClick && (
        <div className="absolute top-4 right-20 opacity-0 pointer-events-none">
          <div onClick={onSecretClick} className="cursor-pointer" />
        </div>
      )}
    </nav>
  );
};