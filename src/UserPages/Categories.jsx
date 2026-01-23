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
  return (
    // <div className="w-full bg-gradient-to-br from-teal-200 via-cyan-300 to-sky-300 px-3 py-3 md:py-5 shadow-md">
      <div className="w-full bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 py-3 md:py-5 shadow-md">
      <div className="user-category-scroll overflow-x-scroll">
        <div className="flex gap-3 md:gap-4 justify-start lg:justify-center pb-2 md:pb-0">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedCategory(item)}
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
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-110 font-bold' 
                    : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 hover:shadow-md hover:scale-105 shadow-sm'
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
