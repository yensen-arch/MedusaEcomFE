import { Link } from "react-router-dom";
import { Scrollbar } from "react-scrollbars-custom";
import {
  RiMenuLine,
  RiCloseLine,
  RiQuestionLine,
  RiSearchLine,
  RiUserLine,
  RiShoppingBagLine,
} from "react-icons/ri";

const menuItems = {
  V00: [
    { label: "TODAY'S DEALS", link: "" },
    { label: "FEB 3", link: "" },
    { label: "JEANS", link: "" },
    { label: "OUTWEAR", link: "" },
    { label: "SHOES", link: "" },
    { label: "T-SHIRTS", link: "" },
    { label: "SHIRTS", link: "" },
    { label: "JEANS", link: "" },
    { label: "JACKETS", link: "" },
    { label: "SHOES", link: "" },
    { label: "DRESSES", link: "" },
    { label: "TOPS", link: "" },
    { label: "JEANS", link: "" },
    { label: "OUTWEAR", link: "" },
    { label: "SHOES", link: "" },
  ],
  WOMAN: [
    { label: "DRESSES", link: "" },
    { label: "TOPS", link: "" },
    { label: "JEANS", link: "" },
    { label: "OUTWEAR", link: "" },
    { label: "SHOES", link: "" },
    { label: "T-SHIRTS", link: "" },
    { label: "SHIRTS", link: "" },
    { label: "JEANS", link: "" },
    { label: "JACKETS", link: "" },
    { label: "SHOES", link: "" },
    { label: "DRESSES", link: "" },
    { label: "TOPS", link: "" },
    { label: "JEANS", link: "" },
    { label: "OUTWEAR", link: "" },
    { label: "SHOES", link: "" },
  ],
  MAN: [
    { label: "T-SHIRTS", link: "" },
    { label: "SHIRTS", link: "" },
    { label: "JEANS", link: "" },
    { label: "JACKETS", link: "" },
    { label: "SHOES", link: "" },
    { label: "T-SHIRTS", link: "" },
    { label: "SHIRTS", link: "" },
    { label: "JEANS", link: "" },
    { label: "JACKETS", link: "" },
    { label: "SHOES", link: "" },
    { label: "T-SHIRTS", link: "" },
    { label: "SHIRTS", link: "" },
    { label: "JEANS", link: "" },
    { label: "JACKETS", link: "" },
    { label: "SHOES", link: "" },
  ],
  KIDS: [
    { label: "TOPS", link: "" },
    { label: "PANTS", link: "" },
    { label: "DRESSES", link: "" },
    { label: "OUTWEAR", link: "" },
    { label: "ACCESSORIES", link: "" },
    { label: "TOPS", link: "" },
    { label: "PANTS", link: "" },
    { label: "DRESSES", link: "" },
    { label: "T-SHIRTS", link: "" },
    { label: "SHIRTS", link: "" },
    { label: "JEANS", link: "" },
    { label: "JACKETS", link: "" },
    { label: "SHOES", link: "" },
    { label: "OUTWEAR", link: "" },
    { label: "ACCESSORIES", link: "" },
  ],
  ARCHIVE: [
    { label: "MAKEUP", link: "" },
    { label: "SKIN CARE", link: "" },
    { label: "FRAGRANCES", link: "" },
    { label: "HAIRCARE", link: "" },
    { label: "TOOLS", link: "" },
    { label: "T-SHIRTS", link: "" },
    { label: "SHIRTS", link: "" },
    { label: "JEANS", link: "" },
    { label: "JACKETS", link: "" },
    { label: "SHOES", link: "" },
  ],
};

export default function NavMenu({
  activeCategory,
  setActiveCategory,
  isMenuOpen,
  onClose,
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      className={`fixed inset-0 md:top-10 md:left-8 bg-white z-50 w-full h-full md:w-[400px] md:h-[80vh] md:border-black md:border-[1px] overflow-hidden transition-transform transition-opacity duration-300 ease-in-out pointer-events-auto  ${
        isMenuOpen
          ? "translate-x-0 opacity-100 visible"
          : "-translate-x-full opacity-0 invisible"
      }`}
    >
      {/* Mobile Header */}
      <div className="flex justify-between items-center p-4 md:hidden">
        <button onClick={onClose} className="p-2">
          <RiCloseLine className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4">
          <Link to="/search/home" className="text-xs md:hidden">
            <RiSearchLine className="w-6 h-6" />
          </Link>
          <RiUserLine className="w-6 h-6" />
          <RiShoppingBagLine className="w-6 h-6" />
        </div>
      </div>

      {/* Desktop Logo - only show on desktop */}
      <div className="hidden md:flex justify-center pt-2 pb-16">
        <Link to="/" className="mb-auto py-2">
          <img
            src="https://static.zara.net/photos///contents/cm/assets/logos/default-light_0.svg?ts=1690441518876"
            alt="ZARA"
            className="h-28 mr-auto px-8 transition-opacity duration-300 ease-in-out opacity-100"
          />
        </Link>
      </div>

      {/* Categories */}
      <div className="flex items-center space-x-8 py-4 border-b border-black px-8">
        {Object.keys(menuItems).map((category) => (
          <button
            key={category}
            className={`text-sm transition-all duration-300 ease-in-out ${
              activeCategory === category
                ? "font-bold text-black"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Items with custom scrollbar */}
      <Scrollbar
        style={{
          height: isMobile ? "calc(100vh - 120px)" : "calc(80vh - 120px)",
        }}
        trackYProps={{
          renderer: ({ elementRef, ...props }) => (
            <div
              ref={elementRef}
              {...props}
              style={{ ...props.style, backgroundColor: "transparent" }}
            />
          ),
        }}
        thumbYProps={{
          renderer: ({ elementRef, ...props }) => (
            <div
              ref={elementRef}
              {...props}
              style={{
                ...props.style,
                backgroundColor: "#888",
                width: "1px",
              }}
            />
          ),
        }}
      >
        <ul className="flex flex-col gap-4 px-8 py-4">
          {menuItems[activeCategory].map((item, index) => (
            <li
              key={index}
              className="transition-transform duration-300 ease-in-out hover:translate-x-2"
            >
              <Link to={item.link} className="text-sm">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Scrollbar>
    </div>
  );
}
