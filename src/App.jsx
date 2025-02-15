import {  useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Components/Navbar";
import AllRoutes from "./Routes/AllRoutes";
import "swiper/css/bundle";
function App() {
  const [activeCategory, setActiveCategory] = useState("WOMAN");
  const categoryNames = ["WOMAN", "MAN", "KIDS", "BEAUTY"];
  const location = useLocation();
  const randomSearchbarPages = ['/', '/search/home'];

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  return (
    <div className="App flex flex-col min-h-screen">
      {!randomSearchbarPages.includes(location.pathname) && (
        <Navbar
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
          categoryNames={categoryNames}
          showSearchBar
        />
      )}
      <div className="flex-1">
        <AllRoutes />
      </div>
    </div>
  );
  
  
}

export default App;
