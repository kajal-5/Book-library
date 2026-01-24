import { useNavigate } from "react-router-dom";

const categories = [
  "All",
  "Science",
  "Mathematics",
  "Comics",
  "Literature",
  "Spiritual",
  "History",  
  "Biography",
  "Stories",
  "Art & Design",
  "Travel",
  "Wellness",
  "Cooking",
];


const Categories = ({ selectedCategory = "All", setSelectedCategory = () => {} }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      navigate("/admin");
    } else {
      const categorySlug = category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
      navigate(`/admin/category/${categorySlug}`);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-red-400 via-purple-500 to-pink-500 px-3 py-3 md:py-5 shadow-md">
      <div className="overflow-x-auto">
        <div className="flex gap-3 md:gap-4 justify-start lg:justify-center pb-2 md:pb-0">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => handleCategoryClick(item)}
              className={`
                px-3 py-2
                text-[12px] md:text-[16px]
                rounded-lg
                whitespace-nowrap
                transition-all duration-300
                font-medium
                flex-shrink-0
                ${
                  selectedCategory === item 
                    ? 'bg-gradient-to-r from-sky-400 to-purple-800 text-white shadow-lg transform scale-110 font-bold' 
                    : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 hover:shadow-md hover:scale-105 shadow-sm'
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
