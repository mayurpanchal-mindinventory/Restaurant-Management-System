import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Clock,
} from "lucide-react";

function Footer() {
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
  };

  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/home/menu", label: "Menu" },
    { path: "/home/bookings", label: "Bookings" },
    { path: "/about", label: "About Us" },
  ];

  const legalLinks = [
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/terms", label: "Terms of Service" },
    { path: "/contact", label: "Contact Us" },
  ];

  return (
    <footer className="absolute w-full z-100 bg-gray-900 text-white ">
      {/* Main Footer Content   */}
      <div className="container mx-auto px-4 md:px-8  py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">
          {/* Company Info */}
          <div className="space-y-4 ">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 p-1.5 rounded-lg">🍽️</div>
              <h3 className="text-xl font-black">
                FOODIE<span className="text-orange-500">HUB</span>
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted local dining guide. Discover amazing restaurants,
              view menus, and book tables seamlessly for an unforgettable dining
              experience.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-orange-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-orange-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-orange-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-orange-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:flex md:flex-col space-y-4 md:justify-center md:items-center ">
            <h4 className="text-lg font-semibold text-orange-400">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => handleNav(link.path)}
                    className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-orange-500" />
                <span className="text-gray-300 text-sm">+91 1234567890</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-orange-500" />
                <span className="text-gray-300 text-sm">
                  mayur.panchal@midninventory
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-orange-500" />
                <span className="text-gray-300 text-sm">
                  miten.patel@midninventory
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-orange-500" />
                <span className="text-gray-300 text-sm">
                  city center,science city,sola,Amd
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-orange-500" />
                <span className="text-gray-300 text-sm">24/7 available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex justify-center items-center">
            <div className="text-center text-gray-400 text-sm">
              © 2026 FoodieHub. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
