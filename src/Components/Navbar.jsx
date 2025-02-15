"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  swiperRef,
  isScrolling,
  isMobile,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isSearchPage = location.pathname === "/search/home";
  const isHomePage = location.pathname === "/";
  const isProductPage = location.pathname.includes("/products/");

  const currentItem =
    categories?.[activeCategory]?.[swiperRef?.current?.swiper?.activeIndex];
  const logoUrl = currentItem?.video
    ? "https://res.cloudinary.com/dmjhto8sd/image/upload/v1739507590/Clothd-green_r3fe9v.webp"
    : "https://res.cloudinary.com/dmjhto8sd/image/upload/v1739507590/Clothd-black_kgtd7e.webp";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleCategoryHover = (category) => {
    if (hoveredCategory !== category) {
      setHoveredCategory(category);
      setActiveCategory(category);
      setIsMenuOpen(true);
    }
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white">
        <div className="w-full flex flex-col">
          {/* Top section */}
          <div className="flex justify-between items-center px-6 py-3 border-b border-black">
            {/* Left: Categories */}
            <div className="flex items-center space-x-6">
              {["V00", "WOMAN", "MAN", "KIDS", "ARCHIVE"].map((category) => (
                <button
                  key={category}
                  className="text-sm hover:font-bold transition-all"
                  onMouseEnter={() => handleCategoryHover(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Center: Logo */}
            <Link
              to="/"
              className="absolute left-1/2 transform -translate-x-1/2"
            >
              <img src={logoUrl} alt="Logo" className="h-12" />
            </Link>

            {/* Right: User links */}
            <div className="flex items-center space-x-6">
              <Link to="/login" className="text-sm">
                LOGIN
              </Link>
              <Link to="/help">
                <RiQuestionLine className="w-5 h-5" />
              </Link>
              <button onClick={toggleCart}>
                <RiShoppingBagLine className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar section */}
          <div
            className={`w-full h-10 transition-transform duration-300 ease-in-out border-b border-black ${
              isVisible ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <Link to={"/search/home"} className="px-6 py-3  flex items-center">
              <RiSearchLine className="w-5 h-5 text-black" />
              <input
                type="text"
                placeholder="WHAT ARE YOU LOOKING FOR?"
                className="w-full ml-4 outline-none text-sm "
              />
            </Link>
          </div>
        </div>
      </nav>

      {/* NavMenu component */}
      <NavMenu
        activeCategory={hoveredCategory || activeCategory}
        setActiveCategory={setActiveCategory}
        isMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
      {/* Dark overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 pointer-events-auto"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Cart component */}
      <Cart isOpen={isCartOpen} />
    </>
  );
};

export default Navbar;
