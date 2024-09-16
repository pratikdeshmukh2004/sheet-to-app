import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronRight,
  faPencil,
  faPlus,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DataContext from "@/Context/dataContext";
import { useRouter } from "next/router";
import Loader from "@/components/loader";
import Header from "@/components/Header";

export default function Pole() {
  const { poles, loadPoles } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const row = poles?.find((row) => row._rowNumber == params.get("pole"));
  const router = useRouter();
  const district = useSearchParams()?.get("district");
  const categories = {
    "Location Information": [
      "district",
      "ULB Name",
      "Ward No",
      "Pole Land Mark/Location",
      "Lattitude",
      "Longitude",
    ],
    "Pole Structure": [
      "Pole type",
      "Pole arrangement",
      "Pole Height",
      "Old / New",
    ],
    "Power & Electrical Details": [
      "CCMS/Timer",
      "CCMS Rating (KW)",
      "Rating (W)",
      "Nos.",
    ],
    "Cable Specifications": [
      "Cable type",
      "Cable Rating (Sq.mm)",
      "Cable length New Installed (m)",
    ],
    "Arm Details": ["Arm Type", "Arm Length"],
    "Accessories & Fixtures": [
      "Coil",
      "GI Pipe",
      "Suspension Clamp",
      "Dead End Clamp",
      "Eye-hook",
    ],
    "Installation Information": ["Date of installation", "Remarks"],
  };

  const handleDelete = (row) => {
    setLoading(true);
    row.delete().then((data) => {
      console.log(row, "deleted....");
      loadPoles();
      setLoading(false);
      router.push(
        "/switch?area=" +
          row.get("Area Code") +
          "&switch=" +
          row.get("Switch No.")
      );
    });
  };

  return (
    <>
      {loading && <Loader />}
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
          <FontAwesomeIcon
            className="text-[8px] text-gray-700 ml-2 mr-2 -mt-4"
            icon={faChevronRight}
          />
          <b>{params.get("pole")}</b>
        </h4>
        <div className="py-10 flex gap-5 border-b border-gray-200">
          <h4 className="text-2xl font-bold">{params.get("pole")}</h4>
          <Link
            className="bg-orange-600 ml-auto py-2 text-md text-white font-bold rounded-lg px-3"
            href={`/pole/edit?pole=${params.get("pole")}`}
          >
            <button>
              <FontAwesomeIcon className="mr-2" icon={faPencil} />
              Edit
            </button>
          </Link>
          <button
            onClick={() => handleDelete(row)}
            className="border border-gray-300 py-2 text-md text-gray-600 font-bold rounded-lg px-3"
          >
            <FontAwesomeIcon className="mr-2" icon={faTrash} />
            Delete
          </button>
        </div>
        
        <div className="py-5">
          {row &&
            Object.keys(categories).map((category, index) => (
              <div key={category} className="mb-5">
                <h3 className="text-lg font-bold text-gray-900 mb-3 ">
                  {category}
                </h3>{" "}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {categories[category].map(
                    (col) =>
                      row.get(col) && (
                        <div
                          key={col}
                          className="flex justify-between lg:flex-col flex-row border-none border-b py-3 border-gray-200"
                        >
                          <h4 className="text-gray-600 font-medium">{col}</h4>
                          <h4 className="text-gray-800 font-medium">
                            {row.get(col)}
                          </h4>
                        </div>
                      )
                  )}
                </div>
                {index < Object.keys(categories).length - 1 && (
                  <hr className="my-4 border-gray-300" />
                )}{" "}
                {/* Add line after each category except the last one */}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
