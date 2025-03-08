"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Navbar from "../Components/Navbar";
import FooterLP from "../Components/FooterLP";
import { motion, AnimatePresence } from "framer-motion";
import { categories, categoriesMobile } from "../data/categoriesData";
import CustomLoader from "../Components/CustomLoader";
import { useNavigate } from "react-router-dom";

const SLIDE_VARIANTS = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};
const Homepage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const activeCategories = isMobile ? categoriesMobile : categories;
  const categoryNames = useMemo(
    () => Object.keys(activeCategories),
    [activeCategories]
  );

  const [activeCategory, setActiveCategory] = useState(categoryNames[0]);
  const [direction, setDirection] = useState(0);
  const swiperRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setActiveCategory(categoryNames[0]);
  }, [categoryNames]);

  const indexNo = useMemo(
    () => categoryNames.indexOf(activeCategory),
    [activeCategory, categoryNames]
  );
  const handlePrev = useCallback(() => {
    if (indexNo > 0) {
      setDirection(-1);
      setActiveCategory(categoryNames[indexNo - 1]);
    }
  }, [indexNo, categoryNames]);

  const handleNext = useCallback(() => {
    if (indexNo < categoryNames.length - 1) {
      setDirection(1);
      setActiveCategory(categoryNames[indexNo + 1]);
    }
  }, [indexNo, categoryNames]);

  const handleCategoryChange = useCallback(
    (category) => {
      const newIndex = categoryNames.indexOf(category);
      setDirection(newIndex > indexNo ? 1 : -1);
      setActiveCategory(category);
    },
    [categoryNames, indexNo]
  );

  useEffect(() => {
    const handleTouchMove = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        scrollTimeoutRef.current = null; // Reset reference
      }, 1000);
    };

    window.addEventListener("touchmove", handleTouchMove);
    return () => window.removeEventListener("touchmove", handleTouchMove);
  }, []);

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;

      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          handleNext(); // Swipe left → Next category
        } else {
          handlePrev(); // Swipe right → Previous category
        }
      }
    };

    if (isMobile) {
      window.addEventListener("touchstart", handleTouchStart);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, handleNext, handlePrev]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [loadingProductId, setLoadingProductId] = useState(null);

  const handleNavigation = (productId) => {
    setLoadingProductId(productId);
    navigate(`/products/${productId}`);
    setLoadingProductId(null);
    setLoading(false);
  };
  // Add preload function
  useEffect(() => {
    const preloadImages = () => {
      const imagesToPreload = activeCategories[activeCategory]
        ?.filter((item) => item.img && item.priority)
        .map((item) => item.img);

      imagesToPreload?.forEach((imageUrl) => {
        const img = new Image();
        img.src = imageUrl;
      });
    };

    preloadImages();
  }, [activeCategory, activeCategories]);

  const renderSlides = useMemo(() => {
    return activeCategories[activeCategory]?.map((ele, index) => (
      <SwiperSlide
        key={`${activeCategory}-${index}`}
        className="w-full h-screen mt-20"
      >
        {ele.type === "footer" ? (
          <FooterLP />
        ) : (
          <div
            onClick={() => {
              if (!isScrolling && scrollTimeoutRef.current === null) {
                handleNavigation(ele.productId);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            {ele.img && (
              <div className="relative">
                <img
                  src={ele.img}
                  alt="Slide"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchpriority={index === 0 ? "high" : "auto"}
                  decoding={index === 0 ? "sync" : "async"}
                  className="w-full h-screen object-cover"
                />
                {loadingProductId === ele.productId && (
                  <div className="absolute z-50 top-10 right-10 p-2">
                    {console.log("loading product")}
                    <CustomLoader />
                  </div>
                )}
              </div>
            )}
            {ele.video && (
              <div className="relative">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-screen object-cover"
                >
                  <source src={ele.video} type="video/mp4" />
                </video>
                {loadingProductId === ele.productId && (
                  <div className="absolute z-50 top-10 right-10 p-2">
                    <CustomLoader />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </SwiperSlide>
    ));
  }, [activeCategory, activeCategories, isScrolling]);
  return (
    <div className="relative w-full min-h-screen cursor-pointer overflow-hidden">
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
        categoryNames={categoryNames}
        categories={activeCategories}
        isScrolling={isScrolling}
        swiperRef={swiperRef}
        isMobile={isMobile}
      />
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={activeCategory}
          custom={direction}
          variants={SLIDE_VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 60 },
            opacity: { duration: 0.2 },
          }}
          className="w-full h-full absolute"
        >
          <Swiper
            modules={[Mousewheel, FreeMode]}
            direction="vertical"
            ref={swiperRef}
            slidesPerView={1}
            mousewheel={true}
            freeMode={true}
            speed={800}
            // onSlideChange={handleSlideChange}
            className="w-full h-full"
          >
            {renderSlides}
          </Swiper>
        </motion.div>
      </AnimatePresence>
      <div className="absolute flex items-center justify-between w-full top-1/2 z-10 px-4">
        {indexNo > 0 && (
          <button
            onClick={handlePrev}
            className="flex items-center bg-transparent border-none font-light text-white"
          >
            <ArrowBackIosIcon fontSize="small" />
          </button>
        )}
        {indexNo < categoryNames.length - 1 && (
          <button
            onClick={handleNext}
            className="flex items-center bg-transparent border-none font-light ml-auto text-white"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Homepage;
