"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  RiMenuLine,
  RiCloseLine,
  RiQuestionLine,
  RiShoppingBagLine,
} from "react-icons/ri";
import NavMenu from "./NavMenu";

const Navbar = ({
  activeCategory,
  setActiveCategory,
  activeIndex,
  categories,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoSize, setLogoSize] = useState("h-40");
  const [isScrolling, setIsScrolling] = useState(false);

  //change the logo based on the bg
  const logoUrl = categories[activeCategory]?.[activeIndex]?.video 
    ? "https://static.zara.net/assets/public/ae9d/d9bd/51f24d7eaf0c/0c9ae293a60b/default-light-green-0.svg?ts=1728680676189"
    : "https://static.zara.net/photos///contents/cm/assets/logos/default-light_0.svg?ts=1690441518876";

  useEffect(() => {
    const timer = setTimeout(() => {
      //the logo animation upon page load
      setLogoSize("h-28");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);
  const handleSearch = () => {
    return;
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

            <div className="flex flex-col justify-center pl-20 relative">
              <Link to="/" className="mb-auto py-2 hidden md:block ">
                <img
                  src={logoUrl}
                  alt="ZARA"
                  className={`transition-all duration-700 ease-in-out ${logoSize}`}
                />
              </Link>

              {/* Categories row - desktop only */}
              <div className="hidden md:flex items-center space-x-8 py-2">
                {["WOMAN", "MAN", "KIDS", "BEAUTY"].map((category) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* Right section: Search and other links */}
          <div className="flex items-center gap-2 sm:gap-6 mb-auto">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="SEARCH"
                className="bg-white mx-2 lg:mx-10 mt-4 text-right border border-black w-[200px] lg:w-[400px] py-1 px-2 text-xs lg:text-sm"
              />
            </div>
            <Link to="/login" className="text-xs mb-auto py-2 hidden md:block">
              LOG IN
            </Link>
            <Link to="/help" className="text-xs mb-auto py-2 hidden md:block">
              HELP
            </Link>
            <Link to="/help" className="text-xs mb-auto py-2 md:hidden">
              <RiQuestionLine className="w-6 h-6" />
            </Link>
            <Link to="/" className="text-xs mb-auto py-2 relative">
              <span className="hidden md:inline">SHOPPING BAG</span>
              <RiShoppingBagLine className="w-6 h-6 md:hidden" />
            </Link>
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

      {/* Responsive search bar */}
      {!isMenuOpen && (
        <div
          className={`px-4 z-50 pb-4 md:hidden fixed bottom-0 left-0 w-full bg-transparent transition-transform duration-300 ${
            isScrolling ? "translate-y-full" : ""
          }`}
        >
          <input
            type="text"
            placeholder="SEARCH"
            onChange={handleSearch}
            className="w-full bg-transparent border border-black py-1 text-sm text-black px-4 text-right"
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
