import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import sheetApiContext from "@/Context/sheetApiContext";
import DataContext from "@/Context/dataContext";

export default function Home() {
  const { areaCodes } = useContext(DataContext);

  return (
    <>
      <div className="bg-[#24282d]">
        <div className="mx-10 lg:mx-[27%]">
          <div className="flex py-2">
            <img
              className="w-6 hidden lg:block h-6 mr-2"
              src="https://res.cloudinary.com/glide/image/fetch/f_auto,h_150,c_limit/https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fglide-prod.appspot.com%2Fo%2Ficon-images%252Fanonymous-0ea76cd1-73a2-4ff5-80ad-d7900de1e6e2.jpeg%3Falt%3Dmedia%26token%3D87542351-bd05-4aac-b0b9-9ddeffb9e267"
            />
            <h2 className="text-lg hidden lg:block text-white font-bold font">
              PGHH Streetlights Pithampur Cluster
            </h2>
          </div>
          <h2 className="text-2xl py-8 font-bold text-white">Area Code</h2>
        </div>
      </div>
      {areaCodes?.length == 0 && (
        <div className="mx-5 lg:mx-[27%] py-2">
          <p className="text-sm text-center text-rose-500">No data found...</p>
        </div>
      )}

      <ul className="mx-5 my-8 text-md cursor-pointer lg:text-lg text-gray-600 font-bold lg:mx-[27%]">
        {areaCodes &&
          areaCodes?.map(
            (row) =>
              row.get("Area Code") && (
                <Link href={`/area?area=${row.get("Area Code")}`}>
                  <li className="border-b hover:bg-gray-100 rounded-t-lg border-gray-300 py-3 flex">
                    <h4 className="ml-2">{row.get("Area Code")}</h4>
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
