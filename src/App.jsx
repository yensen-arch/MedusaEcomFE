import { useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Components/Navbar";
import AllRoutes from "./Routes/AllRoutes";
import "swiper/css/bundle";
function App() {
  const [activeCategory, setActiveCategory] = useState("WOMAN");
  const categoryNames = ["WOMAN", "MAN", "KIDS", "BEAUTY"];
  const location = useLocation();

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  return (
    <div className="App">
      {location.pathname !== "/" && (
        <Navbar
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
          categoryNames={categoryNames}
        />
      )}
      <AllRoutes />
    </div>
  );
}

export default App;
