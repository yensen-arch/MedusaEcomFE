import { useState } from "react";
import { Link } from "react-router-dom"; // React Router's Link

const menuItems = {
  WOMAN: Array(20).fill(null).map((_, i) => `${i + 1} WOMAN ITEM`),
  MAN: Array(20).fill(null).map((_, i) => `${i + 1} MAN ITEM`),
  KIDS: Array(20).fill(null).map((_, i) => `${i + 1} KIDS ITEM`),
  BEAUTY: Array(20).fill(null).map((_, i) => `${i + 1} BEAUTY ITEM`),
};

export default function NavMenu() {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="absolute top-0 left-0 w-full bg-white z-50">
      <div className="flex justify-center space-x-8 py-4 border-b">
        {Object.keys(menuItems).map((category) => (
          <button
            key={category}
            className={`text-sm font-medium ${
              activeCategory === category ? "text-black" : "text-gray-500"
            } hover:text-black transition-colors`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {activeCategory && (
        <div
          className="py-6 px-4 max-h-96 overflow-y-auto"
          style={{
            scrollbarWidth: "1px",
            scrollbarColor: "#888 transparent",
          }}
        >
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
      )}
      <style jsx>{`
        /* Custom scrollbar for the NavMenu */
        .py-6 {
          scrollbar-width: thin;
          scrollbar-color: #888 transparent;
        }

        .py-6::-webkit-scrollbar {
          width: 1px;
        }

        .py-6::-webkit-scrollbar-track {
          background: transparent;
        }

        .py-6::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 1px;
        }
      `}</style>
    </div>
  );
}
