import { useParams } from "react-router-dom";

function Category() {
  const { category } = useParams();
  return <div> {category}</div>;
}

export default Category;
