"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import FooterLP from "../Components/FooterLP";
import { motion, AnimatePresence } from "framer-motion";
import { categories, categoriesMobile } from "../data/categoriesData";

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
  const [activeIndex, setActiveIndex] = useState(0);
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

  useEffect(() => {
    let interval;
    if (!isMobile) {
      // Only set up the interval if not in mobile mode
      interval = setInterval(() => {
        if (swiperRef.current?.swiper && !isScrolling) {
          swiperRef.current.swiper.slideNext();
        }
      }, 15000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isMobile, isScrolling]);

  const handleSlideChange = useCallback(
    (swiper) => {
      setActiveIndex(swiper.activeIndex);
      if (
        activeCategories[activeCategory][swiper.activeIndex]?.type === "footer"
      ) {
        setTimeout(() => {
          swiper.slideTo(0);
        }, 20000);
      }
    },
    [activeCategory, activeCategories]
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

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 300);
  }, []);

  const renderSlides = useMemo(() => {
    return activeCategories[activeCategory]?.map((ele, index) => (
      <SwiperSlide
        key={`${activeCategory}-${index}`}
        className="w-full h-screen"
      >
        {ele.type === "footer" ? (
          <FooterLP />
        ) : (
          <div
            onClick={() => {
              if (!isScrolling) {
                window.location.href = `/products`;
              }
            }}
            style={{ cursor: "pointer" }}
          >
            {ele.img && (
              <img
                src={ele.img}
                alt="Slide"
                className="w-full h-screen object-cover"
              />
            )}
            {ele.video && (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-screen object-cover"
              >
                <source src={ele.video} type="video/mp4" />
              </video>
            )}
          </div>
        )}
      </SwiperSlide>
    ));
  }, [activeCategory, activeCategories, isScrolling]);
  return (
    <div className="relative w-full h-screen cursor-pointer overflow-hidden">
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
            onScroll={handleScroll}
            onTouchStart={() => setIsScrolling(true)}
            onTouchMove={() => setIsScrolling(true)}
            onTouchEnd={() => setIsScrolling(false)}
            speed={800}
            onSlideChange={handleSlideChange}
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
