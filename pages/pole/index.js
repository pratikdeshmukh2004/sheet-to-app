import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronRight,
  faPencil,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DataContext from "@/Context/dataContext";

export default function Pole() {
  const {areaCodes, setAreaCodes} = useContext(DataContext);
  const [search, setSearch] = useState("");
  const params = useSearchParams();


  return (
    <>
      <div className="bg-[#24282d] hidden lg:block">
        <div className="mx-5 lg:mx-[27%]">
          <div className="flex py-3">
            <img
              className="w-6 h-6 mr-2"
              src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-0ea76cd1-73a2-4ff5-80ad-d7900de1e6e2.jpeg%3Falt%3Dmedia%26token%3D87542351-bd05-4aac-b0b9-9ddeffb9e267"
            />
            <h2 className="text-lg text-white font-bold font">
              PGHH Streetlights Pithampur Cluster
            </h2>
          </div>
        </div>
      </div>
      <div className="mx-5 lg:mx-[27%] mt-3">
        <h4 className="text-gray-600 text-sm">
          <Link className="hover:text-blue-500" href={"/"}>
            Area Code
          </Link>
          <FontAwesomeIcon
            className="text-[8px] text-gray-700 ml-2 mr-2 -mt-4"
            icon={faChevronRight}
          />
          <Link
            className="hover:text-blue-500"
            href={`/area?area=${params.get("area")}`}
          >
            {params.get("area")}
          </Link>
          <FontAwesomeIcon
            className="text-[8px] text-gray-700 ml-2 mr-2 -mt-4"
            icon={faChevronRight}
          />
          <Link
            className="hover:text-blue-500"
            href={`/switch?area=${params.get("area")}&switch=${params.get(
              "switch"
            )}`}
          >
            {params.get("switch")}
          </Link>
          <FontAwesomeIcon
            className="text-[8px] text-gray-700 ml-2 mr-2 -mt-4"
            icon={faChevronRight}
          />
          <b>{params.get("pole")}</b>
        </h4>
        <div className="py-5 lg:flex grid-cols-1 gap-5 grid">
          <h4 className="text-2xl font-bold">{params.get("switch")}</h4>
          <button className="bg-orange-600 ml-auto py-2 lg:py-0 text-md text-white font-bold rounded-lg px-3">
            <FontAwesomeIcon className="mr-2" icon={faPencil} />
            Edit
          </button>
        </div>
      </div>
    </>
  );
}
