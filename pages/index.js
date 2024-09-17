import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import sheetApiContext from "@/Context/sheetApiContext";
import DataContext from "@/Context/dataContext";
import Header from "@/components/Header";

export default function Home() {
  const { dataSheet, user } = useContext(DataContext);

  return (
    <>
      <div className="bg-[#24282d]">
        <div className="mx-10 lg:mx-[27%]">
          <Header />
          <h2 className="text-2xl py-3 font-bold text-white">DISTRICT</h2>
        </div>
      </div>
      {dataSheet?.length == 0 && (
        <div className="mx-5 lg:mx-[27%] py-2">
          <p className="text-sm text-center text-rose-500">No data found...</p>
        </div>
      )}

      <ul className="mx-5 my-8 text-md cursor-pointer lg:text-lg text-gray-600 font-bold lg:mx-[27%]">
        {dataSheet &&
          dataSheet?.map(
            (row) =>
              row.get("DISTRICT") && (
                <Link href={`/ulb?district=${row.get("DISTRICT")}`}>
                  <li
                    className="border-b hover:bg-gray-100 rounded-t-lg border-gray-300 py-3 flex"
                  >
                    <h4 className="ml-2">{row.get("DISTRICT")}</h4>
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
