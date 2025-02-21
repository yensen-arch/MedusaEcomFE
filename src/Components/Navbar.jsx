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
import { use } from "framer-motion/client";

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
  const [hovered, setHovered] = useState(null);
  const disabledCategories = ["WOMEN", "MEN", "ARCHIVE"]; //for the 1st drop

  const currentItem =
    categories?.[activeCategory]?.[swiperRef?.current?.swiper?.activeIndex];
  const logoUrl = currentItem?.video
    ? "https://res.cloudinary.com/dmjhto8sd/image/upload/v1739507590/Clothd-green_r3fe9v.webp"
    : "https://res.cloudinary.com/dmjhto8sd/image/upload/v1739507590/Clothd-black_kgtd7e.webp";

  useEffect(() => {
    let startY = 0;
    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      const isScrollingUp = currentY > startY;
      setIsVisible(isScrollingUp);
      startY = currentY;
    };

    const handleScroll = () => {
      if (location.pathname === "/") {
        const swiperEl = swiperRef?.current?.swiper;
        if (swiperEl) {
          const progress = swiperEl.progress;
          setIsVisible(progress < lastScrollY || progress < 0.1);
          setLastScrollY(progress);
        }
      } else {
        setIsVisible(window.scrollY < lastScrollY || window.scrollY < 50);
        setLastScrollY(window.scrollY);
      }
    };
    // Hide navbar when on /search/home
    if (window.location.pathname === "/search/home") {
      setIsVisible(false);
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    swiperRef?.current?.swiper?.on("progress", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      swiperRef?.current?.swiper?.off("progress", handleScroll);
    };
  }, [lastScrollY, swiperRef, location.pathname]);

  const handleCategoryHover = (category) => {
    // if (hoveredCategory !== category) {
    // setHoveredCategory(category);
    // setActiveCategory(category);
    setIsVisible(true);
    setIsMenuOpen(true);
    // }
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white">
        <div className="w-full flex flex-col">
          {/* Top section */}
          <div className="flex justify-between items-center px-6 py-3 border-b border-black">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <RiCloseLine className="w-6 h-6" />
              ) : (
                <RiMenuLine className="w-6 h-6" />
              )}
            </button>

            {/* Desktop Categories */}
            <div className="hidden md:flex items-center space-x-6">
              {["V00", ...disabledCategories].map((category) => (
                <div
                  className="relative"
                  key={category}
                  onMouseEnter={() => {
                    setHovered(category);
                    handleCategoryHover(category);
                  }}
                  onMouseLeave={() => setHovered(null)}
                >
                  <button
                    className={`text-xs hover:font-bold transition-all ${
                      disabledCategories.includes(category) ? "cursor-wait" : ""
                    }`}
                    disabled={disabledCategories.includes(category)}
                  >
                    {category}
                  </button>
                  {hovered === category &&
                    disabledCategories.includes(category) && (
                      <div className="absolute top-6 left-0 z-50 p-2 text-red-500 text-xs bg-white border border-black">
                        MAKING STUFF...
                      </div>
                    )}
                </div>
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
              <Link to="/donations" className="text-xs hidden md:block">
                DONATE
              </Link>
              <Link to="/account" className="text-xs hidden md:block">
                ACCOUNT
              </Link>
              <Link to="/login" className="text-xs hidden md:block">
                LOGIN
              </Link>
              <Link to="/help" className="hidden md:block">
                <RiQuestionLine className="w-5 h-5" />
              </Link>
              <button onClick={toggleCart}>
                <RiShoppingBagLine className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Items */}
          <div
            className={`md:hidden w-full overflow-hidden transition-all duration-300 ${
              isVisible ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {/* Search bar */}
            <Link
              to={"/search/home"}
              className="px-6 py-3 flex items-center border-b border-black"
            >
              <RiSearchLine className="w-5 h-5 text-black" />
              <input
                type="text"
                placeholder="WHAT ARE YOU LOOKING FOR?"
                className="w-full ml-4 outline-none text-sm placeholder:text-black"
              />
            </Link>
          </div>

          {/* Desktop Search bar */}
          <div
            className={`hidden md:block w-full overflow-hidden transition-all duration-300 border-b border-black ${
              isVisible ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <Link to={"/search/home"} className="px-6 py-3 flex items-center">
              <RiSearchLine className="w-5 h-5 text-black" />
              <input
                type="text"
                placeholder="WHAT ARE YOU LOOKING FOR?"
                className="w-full ml-4 outline-none text-sm"
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
        onClose={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Dark overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 pointer-events-auto"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Cart component */}
      <Cart isOpen={isCartOpen} onClose={toggleCart} />
    </>
  );
};

export default Navbar;
