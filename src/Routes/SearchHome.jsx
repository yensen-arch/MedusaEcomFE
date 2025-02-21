"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import SearchProducts from "../Components/SearchProducts";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries";
import CustomLoader from "../Components/CustomLoader";

const SearchHome = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("WOMAN");
  const [selectedCategory, setSelectedCategory] = useState("");
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (data?.categories?.edges?.length) {
      const categoryObjects = data.categories.edges.map((edge) => edge.node);
      setCategories(categoryObjects);
      setSelectedCategory(categoryObjects[0]);
    }
  }, [data]);

  const repeatedCategories = [...Array(5)].flatMap(() => categories);

  const autoScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 1;
      if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 5) {
        scrollRef.current.scrollLeft = 0;
      }
    }
    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(autoScroll);
  };
  const handleMouseEnter = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleMouseLeave = () => {
    animationRef.current = requestAnimationFrame(autoScroll);
  };

  useEffect(() => {
    if (categories.length > 0) {
      animationRef.current = requestAnimationFrame(autoScroll);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [categories]);

  const handleDragStart = (e) => {
    isDragging.current = true;
    startX.current = e.type === "mousedown" ? e.pageX : e.touches[0].pageX;
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
    cancelAnimationFrame(animationRef.current);
  };

  const handleDragMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const pageX = e.type === "mousemove" ? e.pageX : e.touches[0].pageX;
    const walk = (pageX - startX.current) * 1;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    animationRef.current = requestAnimationFrame(autoScroll);
  };

  return (
    <>
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categoryNames={categories.length ? categories : <CustomLoader />}
      />
      <div className="relative mx-auto mt-28 flex flex-col min-h-screen">
        <Link
          to="/"
          className="absolute z-20 hidden md:block right-14 px-4 py-2 bg-black text-white text-xs rounded-none hover:bg-white border border-black hover:text-black transition"
        >
          BACK HOME
        </Link>
        <div className="flex flex-col justify-center items-center">
          <p className="text-sm">WHAT ARE YOU LOOKING FOR?</p>

          {loading ? (
            <p className="mt-10 text-gray-500">
              <CustomLoader />
            </p>
          ) : error ? (
            <p className="mt-10 text-red-500">ERROR: {error.message}</p>
          ) : (
            <div className="relative w-full max-w-4xl">
              <div className="pointer-events-none absolute inset-0 w-full">
                <div className="absolute left-0 top-0 h-full w-[10%] bg-gradient-to-r from-white to-transparent"></div>
                <div className="absolute right-0 top-0 h-full w-[10%] bg-gradient-to-l from-white to-transparent"></div>
              </div>

              <div
                ref={scrollRef}
                className="overflow-hidden mt-10 w-full flex space-x-4 cursor-grab touch-pan-x"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseLeave={handleDragEnd}
                onMouseUp={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
                onMouseEnter={handleMouseEnter} // Pause on hover
              >
                {repeatedCategories.map((category, index) => (
                  <span
                    key={`${category.name}-${index}`}
                    className="mx-2 py-1 px-3 text-xs border border-black hover:bg-gray-300 cursor-pointer whitespace-nowrap"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <SearchProducts selectedCategory={selectedCategory} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchHome;
