import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCart } from "../Redux/App/action";
import {
  RiMenuLine,
  RiCloseLine,
  RiSearchLine,
  RiShoppingBag2Line,
} from "react-icons/ri";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [logoSize, setLogoSize] = useState("h-40");
  const dispatch = useDispatch();
  const { cart } = useSelector((store) => store.AppReducer);
  const { isAuth } = useSelector((store) => store.AuthReducer);

  useEffect(() => {
    if (cart.length === 0) {
      dispatch(getCart());
    }
  }, [cart, dispatch]);

  useEffect(() => {
    // Logo animation on load
    const timer = setTimeout(() => {
      setLogoSize("h-28");
    }, 100);

    // Cleanup
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const menuItems = [
    "NEW",
    "VIEW ALL",
    "BEST SELLERS",
    "WINTER WARDROBE",
    "OUTERWEAR",
    "SWEATERS | CARDIGANS",
    "TROUSERS",
    "JEANS",
    "HOODIES | SWEATSHIRTS",
    "T-SHIRTS",
    "SHIRTS",
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent">
      <div className="w-full flex justify-between items-center px-4 py-2 gap-6">
        {/* Left section: Hamburger and Logo */}
        <div className="flex gap-4 ">
          <button onClick={toggleMenu} className="py-2 mb-auto">
            {isMenuOpen ? (
              <RiCloseLine className="w-6 h-6" />
            ) : (
              <RiMenuLine className="w-6 h-6" />
            )}
          </button>
          <div className="flex flex-col justify-center pl-20 ">
            <Link to="/" className="mb-auto py-2">
              <img
                src="https://static.zara.net/photos///contents/cm/assets/logos/default-dark_0.svg?ts=1690441478954"
                alt="ZARA"
                className={`transition-all duration-700 ${logoSize}`}
              />
            </Link>
            {/* Links below the logo */}
            <div className="flex gap-8 mt-8 text-sm">
              <Link to="/woman" className="hover:underline">
                WOMAN
              </Link>
              <Link to="/man" className="hover:underline">
                MAN
              </Link>
              <Link to="/kids" className="hover:underline">
                KIDS
              </Link>
              <Link to="/beauty" className="hover:underline">
                BEAUTY
              </Link>
            </div>
          </div>
        </div>

        {/* Right section: Search and other links */}
        <div className="flex items-center gap-6 mb-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="SEARCH"
              className="bg-white mx-10 mt-4 text-right border border-black w-[400px] py-1 px-2 "
            />
          </div>
          <Link to="/login" className="text-xs mb-auto py-2">
            LOG IN
          </Link>
          <Link to="/help" className="text-xs mb-auto py-2">
            HELP
          </Link>
          <Link to="/cart" className="text-xs mb-auto py-2">
            SHOPPING BAG
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 pt-32">
          <div className="container mx-auto px-4">
            <div className="flex gap-8 text-sm mb-12">
              <Link to="/woman" className="hover:underline">
                WOMAN
              </Link>
              <Link to="/man" className="hover:underline">
                MAN
              </Link>
              <Link to="/kids" className="hover:underline">
                KIDS
              </Link>
              <Link to="/beauty" className="hover:underline">
                BEAUTY
              </Link>
            </div>
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link to="#" className="text-sm hover:underline">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
