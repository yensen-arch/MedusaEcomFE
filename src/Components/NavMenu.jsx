import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Scrollbar } from "react-scrollbars-custom";

const menuItems = {
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
  BEAUTY: [
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

export default function NavMenu() {
  const [activeCategory, setActiveCategory] = useState("WOMAN");

  useEffect(() => {
    setActiveCategory("WOMAN");
  }, []);

  return (
    <div className="absolute top-0 left-12 bg-white z-10 w-[400px] h-[80vh] border-black border-[1px] overflow-hidden">
      {/* Logo */}
      <div className="flex justify-center pt-2 pb-16">
        <img
          src="https://static.zara.net/photos///contents/cm/assets/logos/default-light_0.svg?ts=1690441518876"
          alt="ZARA"
          className="h-28 mr-auto px-8"
        />
      </div>

      {/* Categories */}
      <div className="flex items-center space-x-8 py-4 border-b border-black px-8">
        {Object.keys(menuItems).map((category) => (
          <button
            key={category}
            className={`text-sm ${
              activeCategory === category
                ? "font-bold text-black"
                : "text-black"
            } hover:text-black transition-colors`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Items with custom scrollbar */}
      <Scrollbar
        style={{ height: "calc(80vh - 120px)" }}
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
        <ul className="flex flex-col gap-4 px-8">
          {menuItems[activeCategory].map((item, index) => (
            <li key={index}>
              <Link to={item.link} className="text-sm hover:underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Scrollbar>
    </div>
  );
}
