import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import FooterLP from "../Components/FooterLP";
import { motion, AnimatePresence } from "framer-motion";
import categories from "../data/categoriesData";

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
  const categoryNames = Object.keys(categories);
  const [activeCategory, setActiveCategory] = useState(categoryNames[0]);
  const [direction, setDirection] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const indexNo = categoryNames.indexOf(activeCategory);

  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.slideNext();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
    if (categories[activeCategory][swiper.activeIndex]?.type === "footer") {
      setTimeout(() => {
        swiper.slideTo(0);
      }, 15000);
    }
  };

  const handlePrev = () => {
    if (indexNo > 0) {
      setDirection(-1);
      setActiveCategory(categoryNames[indexNo - 1]);
    }
  };

  const handleNext = () => {
    if (indexNo < categoryNames.length - 1) {
      setDirection(1);
      setActiveCategory(categoryNames[indexNo + 1]);
    }
  };

  const handleCategoryChange = (category) => {
    const newIndex = categoryNames.indexOf(category);
    setDirection(newIndex > indexNo ? 1 : -1);
    setActiveCategory(category);
  };
  let scrollTimeout = useRef(null);

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 300);
  };
  return (
    <div className="relative w-full h-screen cursor-pointer overflow-hidden">
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
        categoryNames={categoryNames}
        categories={categories}
        isScrolling={isScrolling}
        swiperRef={swiperRef}
        showSearchBar
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
            speed={800}
            onSlideChange={handleSlideChange}
            className="w-full h-full"
          >
            {categories[activeCategory]?.map((ele, index) => (
              <SwiperSlide key={index} className="w-full h-screen">
                {ele.type === "footer" ? (
                  <FooterLP />
                ) : (
                  <Link to={`/products`} state={{ query: ele.path }}>
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
                        className="w-full h-screen object-cover"
                      >
                        <source src={ele.video} type="video/mp4" />
                      </video>
                    )}
                  </Link>
                )}
              </SwiperSlide>
            ))}
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
