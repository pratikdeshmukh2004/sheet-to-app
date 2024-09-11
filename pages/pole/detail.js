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

export default function Pole() {
  const { poles, loadPoles } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const row = poles?.find((row) => row._rowNumber == params.get("pole"));
  const router = useRouter();
  console.log(row);

  const handleDelete = (row) => {
    setLoading(true);
    row.delete().then((data) => {
      console.log(row, "deleted....");
      loadPoles();
      setLoading(false);
      router.push("/switch?area=" + row.get("Area Code") + "&switch=" + row.get("Switch No."));
    });
  };

  return (
    <>
      {loading && <Loader />}
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
            href={`/area?area=${row?.get("Area Code")}`}
          >
            {row?.get("Area Code")}
          </Link>
          <FontAwesomeIcon
            className="text-[8px] text-gray-700 ml-2 mr-2 -mt-4"
            icon={faChevronRight}
          />
          <Link
            className="hover:text-blue-500"
            href={`/switch?area=${row?.get("Area Code")}&switch=${row?.get("Switch No.")}`}
          >
            {row?.get("Switch No.")}
          </Link>
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
        <div className="py-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {row &&
            Object.keys(row.toObject())?.map(
              (col) =>
                row.get(col) && (
                  <div className="flex justify-between lg:flex-col flex-row lg:border-none border-b py-3 border-gray-200">
                    <h4 className="text-gray-600 font-medium">{col}</h4>
                    <h4 className="text-gray-800 font-medium">
                      {row.get(col)}
                    </h4>
                  </div>
                )
            )}
        </div>
      </div>
    </>
  );
}
