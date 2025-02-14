"use client";

import { useState, useRef, useEffect } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import SearchProducts from "../Components/SearchProducts";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries";

const SearchHome = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const [categories, setCategories] = useState([]);

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

  const [activeCategory, setActiveCategory] = useState("WOMAN");
  const [selectedCategory, setSelectedCategory] = useState("");

  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const animationRef = useRef(null);

  // Create repeated categories array - repeat 5 times to ensure smooth looping
  const repeatedCategories = [...Array(5)].flatMap(() => categories);

  const autoScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 1;
      // Check if we need to reset the scroll position
      const scrollWidth = scrollRef.current.scrollWidth;
      const currentScroll = scrollRef.current.scrollLeft;
      // Reset when we've scrolled through one complete set of categories
      if (currentScroll >= (scrollWidth / 5)) {
        scrollRef.current.scrollLeft = 0;
      }
    }
    animationRef.current = requestAnimationFrame(autoScroll);
  };

  useEffect(() => {
    // Start animation only if we have categories
    if (categories.length > 0) {
      animationRef.current = requestAnimationFrame(autoScroll);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [categories]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;

    // Pause animation while dragging
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    // Resume animation after dragging
    animationRef.current = requestAnimationFrame(autoScroll);
  };

  return (
    <>
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categoryNames={categories.length ? categories : ["Loading..."]}
      />
      <div className="mx-auto mt-60 flex flex-col min-h-screen">
        <div className="flex flex-col justify-center items-center">
          <p className="text-lg font-semibold">WHAT ARE YOU LOOKING FOR?</p>

          {loading ? (
            <p className="mt-10 text-gray-500">Loading categories...</p>
          ) : error ? (
            <p className="mt-10 text-red-500">Error: {error.message}</p>
          ) : (
            <div className="relative w-full max-w-4xl">
              <div className="pointer-events-none absolute inset-0 w-full">
                <div className="absolute left-0 top-0 h-full w-[10%] bg-gradient-to-r from-white to-transparent"></div>
                <div className="absolute right-0 top-0 h-full w-[10%] bg-gradient-to-l from-white to-transparent"></div>
              </div>

              <div
                ref={scrollRef}
                className="overflow-hidden mt-10 w-full flex space-x-4 cursor-grab"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
                onMouseUp={handleMouseUp}
              >
                {repeatedCategories.map((category, index) => (
                  <span
                    key={`${category.name}-${index}`}
                    className="mx-2 py-1 px-3 text-sm border border-black hover:bg-gray-300 cursor-pointer whitespace-nowrap"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-12">
          <SearchProducts selectedCategory={selectedCategory} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchHome;
