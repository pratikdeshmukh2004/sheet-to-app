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
import Header from "@/components/Header";
export default function Switch() {
  const { dataSheet } = useContext(DataContext);
  const [search, setSearch] = useState("");
  const district = useSearchParams()?.get("district");
  const ulb = useSearchParams()?.get("ulb");

  return (
    <>
      <div className="bg-[#24282d] hidden lg:block">
        <div className="mx-5 lg:mx-[27%]">
          <Header />
        </div>
      </div>
      <div className="mx-5 lg:mx-[27%] mt-3">
        <h4 className="text-gray-600 text-sm">
          <Link className="hover:text-blue-500" href={"/"}>
            DISTRICT
          </Link>
          <FontAwesomeIcon
            className="text-[8px] text-gray-700 ml-2 mr-2 -mt-4"
            icon={faChevronRight}
          />
          <Link
            className="hover:text-blue-500"
            href={`/ulb?district=${district}`}
          >
            {district}
          </Link>
          <FontAwesomeIcon
            className="text-[8px] text-gray-700 ml-2 mr-2 -mt-4"
            icon={faChevronRight}
          />
          <b>{ulb}</b>
        </h4>
        <div className="py-5 lg:flex grid-cols-1 gap-5 grid">
          <h4 className="text-2xl font-bold">{ulb}</h4>
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

      {dataSheet?.length == 0 && (
        <div className="mx-5 lg:mx-[27%] py-2">
          <p className="text-sm text-center text-rose-500">No data found...</p>
        </div>
      )}

      <ul className="mx-5 my-3 text-md cursor-pointer lg:text-lg text-gray-600 font-bold lg:mx-[27%]">
        {dataSheet &&
          dataSheet
            ?.filter((row) =>
              row
                .get("Ward No")
                ?.toLowerCase()
                .includes(search.toLocaleLowerCase())
            )
            ?.map(
              (row) =>
                row.get("ULB NAME") == ulb && (
                  <Link
                    href={`/pole?district=${district}&ulb=${row.get(
                      "ULB NAME"
                    )}&ward=${row.get("Ward No")}`}
                  >
                    <li className="border-b hover:bg-gray-100 rounded-t-lg border-gray-300 py-3 flex items-center">
                      <div>
                        <h4 className="ml-2">{row.get("Ward No")}</h4>
                        <p className="text-sm text-gray-500 font-medium ml-2">
                          {row.get("ULB NAME")}
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
        {dataSheet == null &&
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
