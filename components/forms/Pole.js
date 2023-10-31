import SelectInput from "./SelectInput";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import DataContext from "@/Context/dataContext";
import { useSearchParams } from "next/navigation";
const Pole = () => {
  const { areaCodes, setAreaCodes } = useContext(DataContext);
  const [values, setValues] = useState({});
  const params = useSearchParams();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setValues({
        ...values,
        Lattitude: position.coords.latitude,
        Longitude: position.coords.longitude,
        "Area Code": params.get("area"),
        "Switch No.": params.get("switch"),
      });
    });
  }, []);
  return (
    <div>
      <div className="px-10 lg:px-[27%] bg-[#24282d]">
        <h2 className="text-2xl py-3 font-bold text-white">New Pole</h2>
      </div>
      <div className="mx-10 lg:mx-[27%]">
        <SelectInput
          isLoading={areaCodes == null}
          label={"Area Code"}
          name={"Area Code"}
          onChange={(value) =>
            setValues({ ...values, "Area Code": value.value })
          }
          value={{ label: values["Area Code"], value: values["Area Code"] }}
          options={areaCodes
            ?.filter((item) => item.get("Area Code"))
            ?.map((item) => ({
              label: item.get("Area Code"),
              value: item.get("Area Code"),
            }))}
        />
        <SelectInput
          label={"Switch No."}
          name={"Switch No."}
          value={{ label: values["Switch No."], value: values["Switch No."] }}
          options={areaCodes
            ?.filter(
              (item) =>
                item.get("Area Code For Switch") &&
                item.get("Area Code For Switch") == values["Area Code"]
            )
            ?.map((item) => ({
              label: item.get("Switch No."),
              value: item.get("Switch No."),
            }))}
        />
      </div>
      <div className="px-10 flex gap-5 py-5 bottom-0 border-t border-gray-300 absolute w-full">
        <button className="bg-orange-600 py-2 text-md text-white font-bold rounded-lg px-5">
          Submit
        </button>
        <Link
          href={`/switch?area=${params.get("area")}&switch=${params.get(
            "switch"
          )}`}
        >
          <button className="border border-gray-400 py-2 text-md text-gray-800 font-bold rounded-lg px-5">
            Cancel
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Pole;
