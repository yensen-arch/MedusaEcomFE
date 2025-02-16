import { Link } from "react-router-dom";
import { Scrollbar } from "react-scrollbars-custom";
import { useEffect, useState } from "react";
import { RiCloseLine, RiSearchLine, RiUserLine, RiShoppingBagLine } from "react-icons/ri";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries";

export default function NavMenu({ activeCategory, isMenuOpen, onClose }) {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (data?.categories?.edges?.length) {
      const categoryObjects = data.categories.edges.map((edge) => edge.node);
      setCategories(categoryObjects);
    }
  }, [data]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuOpen]);

  return (
    <div
      className={`fixed inset-0 md:top-20 bg-white z-40 w-full h-full md:w-1/3 md:border-black md:border-[1px] overflow-hidden transition-transform duration-300 ease-in-out ${
        isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      {/* Mobile Header */}
      <div className="flex justify-between items-center p-4 md:hidden">
        <button onClick={onClose} className="p-2">
          <RiCloseLine className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4" onClick={onClose}>
          <Link to="/search/home">
            <RiSearchLine className="w-6 h-6" />
          </Link>
          <Link to="/login">
            <RiUserLine className="w-6 h-6" />
          </Link>
          <RiShoppingBagLine className="w-6 h-6" />
        </div>
      </div>

      {/* Desktop Close Button */}
      <div className="hidden md:flex justify-end p-4">
        <button onClick={onClose} className="p-2">
          <RiCloseLine className="w-6 h-6" />
        </button>
      </div>

      {/* Items with custom scrollbar */}
      <Scrollbar style={{ height: "70vh" }}>
        <ul className="flex flex-col gap-4 px-8 mt-10">
          {loading ? (
            <p className="text-center">Loading categories...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error.message}</p>
          ) : (
            categories.map((category) => (
              <li key={category.id} className="px-2 hover:translate-x-2 hover:border-black hover:border-[1px]">
                <Link to={`/category/${category.slug}`} className="text-sm ">
                  {category.name.toUpperCase()}
                </Link>
              </li>
            ))
          )}
        </ul>
      </Scrollbar>

      {/* Login & Help options at the bottom */}
      <div className="flex flex-col items-center gap-4 p-4 md:hidden">
        <Link to="/login" className="w-full text-center border border-black py-2 rounded-none">LOGIN</Link>
        <Link to="/help" className="w-full text-center border border-black py-2 rounded-none">HELP</Link>
      </div>
    </div>
  );
}