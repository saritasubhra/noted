import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useCategory } from "../context/CategoryContext";
import { NavLink } from "react-router-dom";

// const categories = [
//   "all",
//   "science",
//   "technology",
//   "food",
//   "travel",
//   "finance",
//   "business",
//   "movies",
//   "fashion",
//   "sports",
//   "creativity",
//   "gaming",
// ];

export default function FilterChipBar() {
  const { categories } = useCategory();

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  if (!categories.length) return;

  return (
    <div className="relative flex items-center w-full overflow-hidden mt-8">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 z-[8] bg-white shadow-md rounded-full p-2"
      >
        <FaAngleLeft />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-hidden whitespace-nowrap scroll-smooth px-10"
      >
        {categories.map((category, i) => (
          <NavLink key={i} to={`/category/${category.categoryName}`}>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition bg-gray-100 text-black hover:bg-gray-300`}
            >
              {category.categoryName}
            </button>
          </NavLink>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 z-[8] bg-white shadow-md rounded-full p-2"
      >
        <FaAngleRight />
      </button>
    </div>
  );
}
