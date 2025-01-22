"use client"

import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { Mousewheel, Pagination } from "swiper"
import "swiper/css"
import "swiper/css/pagination"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Link } from "react-router-dom"
import Navbar from "../Components/Navbar"
import FooterLP from "../Components/FooterLP"

SwiperCore.use([Mousewheel, Pagination])

const Homepage = () => {
  const Women = [
    {
      path: "women1",
      img: "https://static.zara.net/photos///contents/mkt/spots/aw22-north-woman-new/subhome-xmedia-38-3//w/1922/IMAGE-landscape-default-fill-3826ba34-9fad-4264-9ecd-6d2bc9295d9c-default_0.jpg?ts=1663773455159",
    },
    {
      video: "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381505/jeans_mzvwwq.mp4",
    },
    // ... (other Women items)
  ]

  const Men = [
    {
      path: "men1",
      img: "https://static.zara.net/photos///contents/mkt/spots/aw22-north-man-origins/subhome-xmedia-34//w/1294/IMAGE-landscape-1-fill-23c9012f-bdc9-45c1-af3c-8f7c07f86626-default_0.jpg?ts=1664366171420",
    },
    // ... (other Men items)
  ]

  const Kids = [
    {
      video: "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381101/gett0nihpxj7tgkg4tg3.mp4",
      cat: "kids",
    },
    // ... (other Kids items)
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const [indexNo, setIndex] = useState(0)
  const category = ["Women", "Men", "Kids"]

  return (
    <div className="relative w-full h-[calc(100vh-60px)] cursor-pointer">
      <Navbar style={{ display: "none" }} activeIndexs={activeIndex} setIndex={setIndex} />
      <Swiper
        direction="vertical"
        slidesPerView={1}
        mousewheel={true}
        pagination={{
          clickable: true,
        }}
        onTouchMove={(e) => setActiveIndex(e.activeIndex === 0 ? 1 : e.activeIndex === 2 ? 2 : e.activeIndex)}
        className="w-full h-full"
        onScroll={(e) => setActiveIndex(e.activeIndex)}
      >
        {eval(category[indexNo])?.map((ele, index) => (
          <SwiperSlide key={index} className="w-full h-screen">
            <Link to={`/products`} state={{ query: ele.path }}>
              {ele.img ? (
                <img
                  src={ele.img || "/placeholder.svg"}
                  alt={ele.img}
                  className={`w-full h-screen object-cover ${
                    category[indexNo] === "Women" && (index === 4 || index === 6)
                      ? "md:object-contain md:rotate-90 md:bg-[#e3edea] md:object-[0_100%]"
                      : ""
                  } ${`main${category[indexNo]}${index}`}`}
                />
              ) : (
                <video autoPlay loop muted controls={ele.cat !== "kids"} className="w-full h-screen object-cover">
                  <source src={ele.video} type="video/mp4" />
                </video>
              )}
            </Link>
          </SwiperSlide>
        ))}
        <div className="absolute flex items-center justify-between w-full top-1/2 z-10 px-4">
          {indexNo > 0 ? (
            <button
              onClick={() => setIndex((prev) => prev - 1)}
              className={`flex items-center bg-transparent border-none font-light ${
                activeIndex % 2 === 0 ? "text-white" : "text-black"
              }`}
            >
              <ArrowBackIosIcon fontSize="small" />
              <span>{category[indexNo - 1]}</span>
            </button>
          ) : (
            <span></span>
          )}
          {indexNo !== category.length - 1 && (
            <button
              onClick={() => setIndex((prev) => prev + 1)}
              className={`flex items-center bg-transparent border-none font-light ${
                activeIndex % 2 === 0 ? "text-white" : "text-black"
              }`}
            >
              <span>{category[indexNo + 1]}</span>
              <ArrowForwardIosIcon fontSize="small" />
            </button>
          )}
        </div>
      </Swiper>
      <FooterLP />
    </div>
  )
}

export default Homepage

