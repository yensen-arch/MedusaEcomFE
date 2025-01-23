"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCart } from "../Redux/App/action";
import {
  RiMenuLine,
  RiCloseLine,
  
} from "react-icons/ri";
import NavMenu from "./NavMenu";

const Navbar = ({ activeCategory, setActiveCategory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [logoSize, setLogoSize] = useState("h-40");
  const dispatch = useDispatch();
  const { cart } = useSelector((store) => store.AppReducer);

  useEffect(() => {
    if (cart.length === 0) {
      dispatch(getCart());
    }
  }, [cart, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoSize("h-28");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent">
      <div className="w-full flex justify-between items-center px-4 py-2 gap-6">
        {/* Left section: Hamburger and Logo */}
        <div >
          <button onClick={toggleMenu} className="py-2 mb-auto">
            {isMenuOpen ? (
              <RiCloseLine className="w-6 h-6" />
            ) : (
              <RiMenuLine className="w-6 h-6" />
            )}
          </button>

          <div className="flex flex-col justify-center pl-20 relative">
            <Link to="/" className="mb-auto py-2">
              <img
                src="https://static.zara.net/photos///contents/cm/assets/logos/default-light_0.svg?ts=1690441518876"
                alt="ZARA"
                className={`transition-all duration-700 ${logoSize}`}
              />
            </Link>

            {/* Categories row */}
            <div className="flex items-center space-x-8 py-2">
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

            {/* NavMenu component */}
            {isMenuOpen && (
              <NavMenu
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            )}
          </div>
        </div>

        {/* Right section: Search and other links */}
        <div className="flex items-center gap-6 mb-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="SEARCH"
              className="bg-white mx-10 mt-4 text-right border border-black w-[400px] py-1 px-2"
            />
          </div>
          <Link to="/login" className="text-xs mb-auto py-2">
            LOG IN
          </Link>
          <Link to="/help" className="text-xs mb-auto py-2">
            HELP
          </Link>
          <Link to="/cart" className="text-xs mb-auto py-2 relative">
            SHOPPING BAG
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
