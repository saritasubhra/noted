import { CgSpinner } from "react-icons/cg";

function Spinner() {
  return (
    <div className="flex justify-center  mt-16">
      <CgSpinner size={40} className="animate-spin" />
    </div>
  );
}

export default Spinner;
