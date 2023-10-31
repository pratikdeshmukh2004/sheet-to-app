import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DataContext from "@/Context/dataContext";
export default function Switch() {
  const { areaCodes } = useContext(DataContext);
  const [search, setSearch] = useState("");
  const area = useSearchParams()?.get("area");

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
          <b>{area}</b>
        </h4>
        <div className="py-5 lg:flex grid-cols-1 gap-5 grid">
          <h4 className="text-2xl font-bold">{area}</h4>
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
        </div>
      </div>

      {areaCodes?.length == 0 && (
        <div className="mx-5 lg:mx-[27%] py-2">
          <p className="text-sm text-center text-rose-500">No data found...</p>
        </div>
      )}

      <ul className="mx-5 my-3 text-md cursor-pointer lg:text-lg text-gray-600 font-bold lg:mx-[27%]">
        {areaCodes &&
          areaCodes
            ?.filter((row) =>
              row
                .get("Switch No.")
                ?.toLowerCase()
                .includes(search.toLocaleLowerCase())
            )
            ?.map(
              (row) =>
                row.get("Area Code For Switch") == area && (
                  <Link
                    href={`/switch?area=${row.get(
                      "Area Code For Switch"
                    )}&switch=${row.get("Switch No.")}`}
                  >
                    <li className="border-b hover:bg-gray-100 rounded-t-lg border-gray-300 py-3 flex items-center">
                      <div>
                        <h4 className="ml-2">{row.get("Switch No.")}</h4>
                        <p className="text-sm text-gray-500 font-medium ml-2">
                          {row.get("Area Code For Switch")}
                        </p>
                      </div>
                      <FontAwesomeIcon
                        className="ml-auto text-sm mt-2 mr-5"
                        icon={faChevronRight}
                      />
                    </li>
                  </Link>
                )
            )}
        {areaCodes == null &&
          [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          ].map((item) => {
            return (
              <li className="bg-gray-200 animate-pulse py-5 rounded my-2"></li>
            );
          })}
      </ul>
    </>
  );
}
