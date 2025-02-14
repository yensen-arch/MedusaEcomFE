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
  const [logoSize, setLogoSize] = useState("h-40");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const isSearchPage = location.pathname === "/search/home";
  const isHomePage= location.pathname === "/";
  const isProductPage = location.pathname.includes("/products/");
  // Change the logo based on the bg

  const currentItem =
    categories?.[activeCategory]?.[swiperRef?.current?.swiper?.activeIndex];

  const logoUrl = currentItem?.video
    ? "https://res.cloudinary.com/dmjhto8sd/image/upload/v1739507590/Clothd-green_r3fe9v.webp"
    : "https://res.cloudinary.com/dmjhto8sd/image/upload/v1739507590/Clothd-black_kgtd7e.webp";

  useEffect(() => {
    const timer = setTimeout(() => {
      // The logo animation upon page load
      setLogoSize("h-28");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Hide logo and search bar when scrolling
    setIsVisible(!isScrolling);
  }, [isScrolling]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 bg-transparent">
        <div className="w-full flex justify-between items-center px-4 py-2 gap-6">
          {/* Left section: Hamburger and Logo */}
          <div>
            <button onClick={toggleMenu} className="py-2 mb-auto">
              {isMenuOpen ? (
                <RiCloseLine className="w-6 h-6" />
              ) : (
                <RiMenuLine className="w-6 h-6" />
              )}
            </button>
            {!isProductPage && (
              <div className="flex flex-col justify-center pl-20 relative">
                {/* Hide logo on product page */}

                <Link
                  to="/"
                  className={`mb-auto py-2 transition-opacity duration-500 ${
                    isScrolling && isMobile ? "opacity-0" : "opacity-100"
                  } `}
                >
                  <img
                    src={logoUrl || "/placeholder.svg"}
                    alt="ZARA"
                    className={`transition-all duration-700 ease-in-out 
                    mt-[-3.5rem] ml-[-3rem] 
                    md:mt-0 md:ml-0 ${logoSize}`}
                  />
                </Link>

                {/* Categories row - desktop only */}
                <div className="hidden md:flex items-center space-x-8 py-2">
                  {["V00", "WOMAN", "MAN", "KIDS", "ARCHIVE"].map(
                    (category) => (
                      <button
                        key={category}
                        className={"text-sm"}
                        onClick={() => {
                          setActiveCategory(category);
                          setIsMenuOpen(true);
                        }}
                      >
                        {category}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right section: Search and other links */}
          <div className="flex items-center gap-2 sm:gap-6 mb-auto">
            {!isSearchPage && (
              <>
                <div className="relative hidden lg:block rounded-none ">
                  <Link to={"/search/home"}>
                    <input
                      type="text"
                      placeholder="SEARCH"
                      className="bg-white mx-2 lg:mx-10 mt-4 text-right border border-black lg:w-[300px] py-1 px-2 text-xs lg:text-sm rounded-none appearance-none"
                    />
                  </Link>
                </div>
                {/* For Tablets */}
                <Link
                  to="/search/home"
                  className="hidden md:block lg:hidden  lg:mx-10  text-xs lg:text-sm"
                >
                  SEARCH
                </Link>
              </>
            )}
            {!isSearchPage &&(
              <Link to="/search/home" className="text-xs md:hidden">
                <RiSearchLine className="w-6 h-6" />
              </Link>
            )}
            <Link to="/login" className="text-xs mb-auto py-2 hidden md:block">
              LOG IN
            </Link>
            <Link to="/help" className="text-xs mb-auto py-2 hidden md:block">
              HELP
            </Link>
            <Link to="/help" className="text-xs mb-auto py-2 md:hidden">
              <RiQuestionLine className="w-6 h-6" />
            </Link>
            <button
              onClick={toggleCart}
              className="text-xs mb-auto py-2 relative"
            >
              <span className="hidden md:block">SHOPPING BAG</span>
              <RiShoppingBagLine className="w-6 h-6 md:hidden" />
            </button>
          </div>
        </div>
      </nav>

      {/* NavMenu component */}
      <NavMenu
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        isMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Cart component */}
      <Cart isOpen={isCartOpen} />

      {/* Responsive search bar */}
      {!isMenuOpen && isHomePage && !isProductPage && (
        <div
          className={`px-4 z-50 pb-4 md:hidden fixed bottom-0 left-0 w-full bg-transparent transition-transform duration-300 ${
            isVisible ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <Link to="/search/home">
            <input
              type="text"
              placeholder="SEARCH"
              className="w-full rounded-none bg-transparent border border-black py-1 text-sm text-black px-4 text-right"
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
