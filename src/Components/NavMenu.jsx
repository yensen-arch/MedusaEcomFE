import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const menuItems = {
  WOMAN: Array(20)
    .fill(null)
    .map((_, i) => `${i + 1} WOMAN ITEM`),
  MAN: Array(20)
    .fill(null)
    .map((_, i) => `${i + 1} MAN ITEM`),
  KIDS: Array(20)
    .fill(null)
    .map((_, i) => `${i + 1} KIDS ITEM`),
  BEAUTY: Array(20)
    .fill(null)
    .map((_, i) => `${i + 1} BEAUTY ITEM`),
}

export default function NavMenu() {
  const [activeCategory, setActiveCategory] = useState("WOMAN")

  useEffect(() => {
    setActiveCategory("WOMAN")
  }, [])

  const scrollbarStyle = {
    scrollbarWidth: "thin",
    scrollbarColor: "#888 transparent",
    "&::-webkit-scrollbar": {
      width: "1px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888",
    },
  }

  return (
    <div className="absolute top-0 left-12 bg-white z-10 w-[400px] h-[80vh] border-black border-[1px]">
      {/* Logo */}
      <div className="flex justify-center pt-2">
        <img
          src="https://static.zara.net/photos///contents/cm/assets/logos/default-light_0.svg?ts=1690441518876"
          alt="ZARA"
          className="h-28 mr-auto pl-8 mb-auto"
        />
      </div>

      {/* Categories */}
      <div className="flex items-center space-x-8 py-4 border-b border-black px-4">
        {Object.keys(menuItems).map((category) => (
          <button
            key={category}
            className={`text-sm ${
              activeCategory === category ? "font-bold text-black" : "text-black"
            } hover:text-black transition-colors`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="py-6 px-4 max-h-96 overflow-y-auto" style={scrollbarStyle}>
        <ul className="flex flex-col gap-4">
          {menuItems[activeCategory].map((item, index) => (
            <li key={index}>
              <Link to="#" className="text-sm hover:underline">
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

