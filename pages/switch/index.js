import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronRight,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DataContext from "@/Context/dataContext";

export default function Pole() {
  const { poles } = useContext(DataContext);

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
          <b>{params.get("switch")}</b>
        </h4>
        <div className="py-5 lg:flex grid-cols-1 gap-5 grid">
          <h4 className="text-2xl font-bold">{params.get("switch")}</h4>
          <div className="border w-full lg:w-2/5 border-gray-300 rounded-lg ml-auto px-2 text-sm flex">
            <FontAwesomeIcon
              className="text-gray-400 mr-4 py-2 text-lg"
              icon={faSearch}
            />
            <input
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              type="search"
              className=" bg-white outline-none font-bold text-gray-600 w-full"
            />
          </div>
          <Link
            href={`/pole/new?area=${params.get("area")}&switch=${params.get(
              "switch"
            )}`}
            className="bg-orange-600 py-3 text-center justify-center flex items-center lg:py-0 text-md text-white font-bold rounded-lg px-3"
          >
            <FontAwesomeIcon className="mr-2" icon={faPlus} />
            New Pole
          </Link>
        </div>
      </div>
      {poles?.length == 0 && (
        <div className="mx-5 lg:mx-[27%] py-2">
          <p className="text-sm text-center text-rose-500">No data found...</p>
        </div>
      )}

      <ul className="mx-5 my-8 grid grid-cols-2 gap-5 lg:grid-cols-4 text-md cursor-pointer lg:text-lg text-gray-600 font-bold lg:mx-[27%]">
        {poles == null &&
          [
            1, 2, 3, 4
          ].map((item) => {
            return (
              <li className="bg-gray-200 animate-pulse py-8 rounded border border-gray-400"></li>
            );
          })}
        {poles &&
          poles
            ?.filter((row) =>
              row
                .get("Pole No.")
                ?.toLowerCase()
                ?.includes(search.toLocaleLowerCase())
            )
            ?.map(
              (row) =>
                row.get("Area Code") == params.get("area") &&
                row.get("Switch No.") == params.get("switch") && (
                  <Link
                    href={`/pole?pole=${row._rowNumber}`}
                  >
                    <li className="border p-3 hover:bg-gray-100 rounded-lg border-gray-300 py-3 flex items-center">
                      <div>
                        <h4 className="ml-2">{row.get("Pole No.")}</h4>
                        <p className="text-sm text-gray-500 font-medium ml-2">
                          {row.get("Road/Street Name")}
                        </p>
                      </div>
                    </li>
                  </Link>
                )
            )}
      </ul>
    </>
  );
}
