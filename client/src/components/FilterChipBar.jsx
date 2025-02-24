import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const categories = [
  "All",
  "Science",
  "Technology",
  "Food",
  "Travel",
  "Finance",
  "Business",
  "Movies",
  "Fashion",
  "Sports",
  "Social Media",
  "Gaming",
];

export default function FilterChipBar() {
  const [active, setActive] = useState("All");
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex items-center w-full overflow-hidden px-4">
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
          <motion.button
            key={i}
            onClick={() => setActive(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              active === category
                ? "bg-black text-white"
                : "bg-gray-100 text-black hover:bg-gray-300"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {category}
          </motion.button>
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
