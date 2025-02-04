"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiMenuLine,
  RiCloseLine,
  RiQuestionLine,
  RiShoppingBagLine,
  RiSearchLine,
} from "react-icons/ri";
import NavMenu from "./NavMenu";
import Cart from "./Cart";

const Navbar = ({
  activeCategory,
  setActiveCategory,
  activeIndex,
  categories,
  showSearchBar,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoSize, setLogoSize] = useState("h-40");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const isSearchPage = location.pathname === "/search/home";

  const logoUrl = categories?.[activeCategory]?.[activeIndex]?.video
    ? "https://static.zara.net/assets/public/ae9d/d9bd/51f24d7eaf0c/0c9ae293a60b/default-light-green-0.svg?ts=1728680676189"
    : "https://static.zara.net/photos///contents/cm/assets/logos/default-light_0.svg?ts=1690441518876";

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoSize("h-28");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const transitionClasses = `transform transition-all duration-300 ease-in-out ${
    isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
  }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 bg-transparent ${transitionClasses}`}
      >
        <div className="w-full flex justify-between items-center px-4 py-2 gap-6">
          <div className="flex items-center gap-4">
            <button onClick={toggleMenu} className="py-2">
              {isMenuOpen ? (
                <RiCloseLine className="w-6 h-6" />
              ) : (
                <RiMenuLine className="w-6 h-6" />
              )}
            </button>
            <Link to="/" className="py-2 block">
              <img
                src={logoUrl || "/placeholder.svg"}
                alt="ZARA"
                className={`transition-all duration-700 ease-in-out ${logoSize}`}
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            {showSearchBar && !isSearchPage && (
              <div className="relative hidden md:block">
                <Link to={"/search/home"}>
                  <input
                    type="text"
                    placeholder="SEARCH"
                    className="bg-white mx-2 lg:mx-10 mt-4 text-right border border-black w-[200px] lg:w-[400px] py-1 px-2 text-xs lg:text-sm"
                  />
                </Link>
              </div>
            )}
            {!isSearchPage && (
              <Link to="/search/home" className="text-xs md:hidden">
                <RiSearchLine className="w-6 h-6" />
              </Link>
            )}
            <Link to="/login" className="text-xs py-2 hidden md:block">
              LOG IN
            </Link>
            <Link to="/help" className="text-xs py-2 hidden md:block">
              HELP
            </Link>
            <Link to="/help" className="text-xs py-2 md:hidden">
              <RiQuestionLine className="w-6 h-6" />
            </Link>
            <button onClick={toggleCart} className="text-xs py-2 relative">
              <span className="hidden md:inline">SHOPPING BAG</span>
              <RiShoppingBagLine className="w-6 h-6 md:hidden" />
            </button>
          </div>
        </div>
      </nav>

      <NavMenu
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        isMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <Cart isOpen={isCartOpen} />

      {!isMenuOpen && !isSearchPage && (
        <div
          className={`px-4 z-50 pb-4 md:hidden fixed bottom-0 left-0 w-full bg-transparent transition-transform duration-300 ${
            !isVisible ? "translate-y-full" : "translate-y-0"
          }`}
        >
          <Link to="/search/home">
            <input
              type="text"
              placeholder="SEARCH"
              className="w-full bg-transparent border border-black py-1 text-sm text-black px-4 text-right"
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
