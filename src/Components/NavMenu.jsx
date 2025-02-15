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
      className={`fixed inset-0 md:top-24 bg-white z-50 w-full h-full md:w-1/3 md:h-full md:border-black md:border-[1px] overflow-hidden transition-transform transition-opacity duration-300 ease-in-out pointer-events-auto  ${
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
          <Link to="/login">
            {" "}
            <RiUserLine className="w-6 h-6" />
          </Link>
          <RiShoppingBagLine className="w-6 h-6" />
        </div>
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
