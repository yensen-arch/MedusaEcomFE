import { Link } from "react-router-dom";
import { Scrollbar } from "react-scrollbars-custom";
import { useEffect, useState } from "react";
import MatrixText from "./MatrixText";
import CustomLoader from "./CustomLoader";
import { useAuth } from "../context/AuthContext";
import {
  RiCloseLine,
  RiSearchLine,
  RiUserLine,
  RiShoppingBagLine,
  RiInstagramLine,
  RiTiktokFill,
} from "react-icons/ri";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries";

export default function NavMenu({ activeCategory, isMenuOpen, onClose }) {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const [categories, setCategories] = useState([]);
  const [hovered, setHovered] = useState(null);
  const { isAuth } = useAuth();
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

  const additionalLinks = [
    { title: "LOOKBOOK", path: "/lookbook" },
    { title: "DONATE", path: "/donations" },
    { title: "ACCOUNT", path: "/account" },
    { title: "OUR MISSION", path: "/mission" },
    { title: "WORK WITH US", path: "/work-with-us" }, // Updated path
  ];

  const socialLinks = [
    { Icon: RiInstagramLine, path: "https://www.instagram.com/clothd.co/" },
    { Icon: RiTiktokFill, path: "https://tiktok.com/@clothd" },
  ];
  const disabledCategories = ["WOMAN", "MAN", "ARCHIVE"]; //for the 1st drop

  return (
    <div
      className={`fixed inset-0 md:top-20 bg-white z-40 w-full h-full md:w-1/3 md:border-black md:border-[1px] overflow-hidden transition-transform duration-300 ease-in-out ${
        isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
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
      <Scrollbar
        style={{ height: "calc(100vh - 280px)" }}
        trackYProps={{ style: { width: "4px" } }}
      >
        <div className="flex flex-col sm:gap-4 px-4">
          {/* Main Categories */}
          <ul className="flex flex-col gap-4 px-4 mt-8">
            {loading ? (
              <p className="flex items-center justify-center">
                <CustomLoader />
              </p>
            ) : error ? (
              <p className="text-red-500 text-xs">ERROR: {error.message}</p>
            ) : (
              categories.map((category) => (
                <li
                  key={category.id}
                  className="px-2 hover:translate-x-2 hover:border-black hover:border-[1px] transition-transform"
                  onMouseEnter={() => setHovered(category.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {disabledCategories.includes(category.name.toUpperCase()) ? (
                    <div
                      className="text-sm cursor-default"
                      onClick={
                        category.name.toUpperCase() === "V00"
                          ? onClose
                          : undefined
                      }
                    >
                      {hovered === category.id ? (
                        <MatrixText
                          originalText={category.name.toUpperCase()}
                          finalText="COMING SOON"
                          isHovering={hovered === category.id}
                        />
                      ) : (
                        category.name.toUpperCase()
                      )}
                    </div>
                  ) : (
                    <Link to={`/category/${category.id}`} className="text-sm">
                      <div>{category.name.toUpperCase()}</div>
                    </Link>
                  )}
                </li>
              ))
            )}
          </ul>

          {/* Additional Links */}
          <div className="px-4 border-t border-slate-300 mt-4">
            <ul className="flex flex-col gap-4 mt-8">
              {additionalLinks.map((link) => (
                <li
                  key={link.title}
                  className="px-2 hover:translate-x-2 hover:border-gray-600 hover:border-[1px] transition-transform"
                >
                  <Link to={link.path} className="text-sm text-gray-600">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Icons */}
          <div className="px-4 mt-6 sm:mt-2">
            <div className="flex justify-start gap-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  <social.Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Scrollbar>

      {/* Mobile Login/Register Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white md:hidden border-t border-black">
        <div className="flex flex-col gap-4 p-4 pb-12">
          {!isAuth && (
            <>
              <Link
                to="/login"
                className="w-full text-center border border-black py-2 text-white bg-black"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className="w-full text-center border border-black py-2"
              >
                REGISTER
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
