import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import SelectInput from "./SelectController";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import DataContext from "@/Context/dataContext";
import { useSearchParams } from "next/navigation";
import InputController from "./InputController";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Loader from "../loader";

import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Pole = ({ isEditing = null }) => {
  const { dataSheet, loadPoles, poles, doc } = useContext(DataContext);
  const [values, setValues] = useState({});
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [positoin, setPosition] = useState({ lat: "", long: "" });
  const [form, setForm] = useState([
    {
      type: "select",
      label: "District",
      options: dataSheet
        ?.filter((item) => item.get("DISTRICT"))
        ?.map((item) => ({
          label: item.get("DISTRICT"),
          value: item.get("DISTRICT"),
        })),
    },
    {
      type: "select",
      label: "ULB Name",
      options: dataSheet
        ?.filter(
          (item) =>
            item.get("District for ULB") &&
            item.get("District for ULB") == values["District"]
        )
        ?.map((item) => ({
          label: item.get("ULB"),
          value: item.get("ULB"),
        })),
    },
    {
      type: "select",
      label: "Ward No",
      options: dataSheet
        ?.filter(
          (item) =>
            item.get("ULB NAME") && item.get("ULB NAME") == values["ULB Name"]
        )
        ?.map((item) => ({
          label: item.get("Ward No"),
          value: item.get("Ward No"),
        })),
    },
    {
      type: "text",
      label: "Pole Land Mark/ Location",
      
    },
    {
      type: "select",
      label: "Pole type",
      category: "Pole Details",
      options: dataSheet
        ?.filter((item) => item.get("Pole type"))
        ?.map((item) => ({
          label: item.get("Pole type"),
          value: item.get("Pole type"),
        })),
    },
    {
      type: "select",
      label: "Pole arrangement",
      category: "Pole Details",
      options: dataSheet
        ?.filter((item) => item.get("Pole arrangement"))
        ?.map((item) => ({
          label: item.get("Pole arrangement"),
          value: item.get("Pole arrangement"),
        })),
    },
    {
      type: "select",
      label: "Pole Height",
      category: "Pole Details",
      options: dataSheet
        ?.filter((item) => item.get("Pole Height"))
        ?.map((item) => ({
          label: item.get("Pole Height"),
          value: item.get("Pole Height"),
        })),
    },
    {
      type: "text",
      label: "Lattitude",
      category: "Pole Details"
    },
    {
      type: "text",
      label: "Longitude",
      category: "Pole Details"
    },
    {
      type: "select",
      label: "Old / New",
      category: "LED",
      options: dataSheet
        ?.filter((item) => item.get("Old / New"))
        ?.map((item) => ({
          label: item.get("Old / New"),
          value: item.get("Old / New"),
        })),
    },
    {
      type: "select",
      label: "Rating (W)",
      category: "LED",
      options: dataSheet
        ?.filter((item) => item.get("Rating (W)"))
        ?.map((item) => ({
          label: item.get("Rating (W)"),
          value: item.get("Rating (W)"),
        })),
    },
    {
      type: "select",
      label: "Nos.",
      category: "LED",
      options: dataSheet
        ?.filter((item) => item.get("Nos."))
        ?.map((item) => ({
          label: item.get("Nos."),
          value: item.get("Nos."),
        })),
    },{
      type: "select",
      label: "Make",
      category: "LED",
      options: dataSheet
        ?.filter((item) => item.get("Make"))
        ?.map((item) => ({
          label: item.get("Make"),
          value: item.get("Make"),
        })),
    },{
      type: "select",
      label: "Arm Type",
      category: "LED",
      options: dataSheet
        ?.filter((item) => item.get("Arm Type"))
        ?.map((item) => ({
          label: item.get("Arm Type"),
          value: item.get("Arm Type"),
        })),
    },{
      type: "select",
      label: "Arm Length",
      category: "LED",
      options: dataSheet
        ?.filter((item) => item.get("Arm Length"))
        ?.map((item) => ({
          label: item.get("Arm Length"),
          value: item.get("Arm Length"),
        })),
    },{
      type: "select",
      label: "CCMS/ Timer",
      category: "Feeder Panel",
      options: dataSheet
        ?.filter((item) => item.get("CCMS/ Timer"))
        ?.map((item) => ({
          label: item.get("CCMS/ Timer"),
          value: item.get("CCMS/ Timer"),
        })),
    },{
      type: "select",
      label: "CCMS Rating (KW)",
      category: "Feeder Panel",
      options: dataSheet
        ?.filter((item) => item.get("CCMS Rating (KW)"))
        ?.map((item) => ({
          label: item.get("CCMS Rating (KW)"),
          value: item.get("CCMS Rating (KW)"),
        })),
    },{
      type: "select",
      label: "Coil",
      category: "Feeder Panel",
      options: dataSheet
        ?.filter((item) => item.get("Coil"))
        ?.map((item) => ({
          label: item.get("Coil"),
          value: item.get("Coil"),
        })),
    },{
      type: "select",
      label: "GI Pipe",
      category: "Feeder Panel",
      options: dataSheet
        ?.filter((item) => item.get("GI Pipe"))
        ?.map((item) => ({
          label: item.get("GI Pipe"),
          value: item.get("GI Pipe"),
        })),
    },{
      type: "text",
      label: "Cable length New Installed (m)",
      category: "Cable"
    },{
      type: "select",
      label: "Cable type (OH/UG)",
      category: "Cable",
      options: dataSheet
        ?.filter((item) => item.get("Cable type (OH/UG)"))
        ?.map((item) => ({
          label: item.get("Cable type (OH/UG)"),
          value: item.get("Cable type (OH/UG)"),
        })),
    },{
      type: "select",
      label: "Cable Rating (Sq.mm)",
      category: "Cable",
      options: dataSheet
        ?.filter((item) => item.get("Cable Rating (Sq.mm)"))
        ?.map((item) => ({
          label: item.get("Cable Rating (Sq.mm)"),
          value: item.get("Cable Rating (Sq.mm)"),
        })),
    },{
      type: "select",
      label: "Suspension Clamp",
      category: "Cable",
      options: dataSheet
        ?.filter((item) => item.get("Suspension Clamp"))
        ?.map((item) => ({
          label: item.get("Suspension Clamp"),
          value: item.get("Suspension Clamp"),
        })),
    },{
      type: "select",
      label: "Dead End Clamp",
      category: "Cable",
      options: dataSheet
        ?.filter((item) => item.get("Dead End Clamp"))
        ?.map((item) => ({
          label: item.get("Dead End Clamp"),
          value: item.get("Dead End Clamp"),
        })),
    },{
      type: "select",
      label: "Eye-hook",
      category: "LED",
      options: dataSheet
        ?.filter((item) => item.get("Eye-hook"))
        ?.map((item) => ({
          label: item.get("Eye-hook"),
          value: item.get("Eye-hook"),
        })),
    },
    {
      type: "text",
      label: "Remarks",
    },
    {
      type: "date",
      label: "Date of installation",
    },
    {
      type: "file",
      label: "Image",
    },
  ]);

  useEffect(
    (lat, long) => {
      setValues({
        ...values,
        Lattitude: positoin.lat,
        Longitude: positoin.long,
      });
    },
    [positoin]
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    });
  }, [navigator]);

  useEffect(() => {
    let prefilled = {};
    if (isEditing) {
      const row = poles?.find((row) => row._rowNumber == params.get("pole"));
      const row_data = row?.toObject();
      const empty_fields = Object.keys(row_data).filter(
        (key) => row_data[key] !== ""
      );
      empty_fields.map((item) => {
        prefilled[item] = row_data[item];
      });
    } else {
      prefilled["District"] = params.get("district");
      prefilled["ULB Name"] = params.get("ulb");
      prefilled["Ward No"] = params.get("ward");
    }
    setValues(prefilled);
  }, []);

  useEffect(() => {
    const filteredForm = form;
    filteredForm.map((input) => {
      if (input.label === "ULB Name") {
        input.options = dataSheet
          ?.filter(
            (item) =>
              item.get("District for ULB") &&
              item.get("District for ULB") == values["District"]
          )
          ?.map((item) => ({
            label: item.get("ULB"),
            value: item.get("ULB"),
          }));
      } else if (input.label === "Ward No") {
        input.options = dataSheet
          ?.filter(
            (item) =>
              item.get("ULB NAME") && item.get("ULB NAME") == values["ULB Name"]
          )
          ?.map((item) => ({
            label: item.get("Ward No"),
            value: item.get("Ward No"),
          }));
      }
    });
    setForm(filteredForm);
  }, [values]);

  const createNewPole = async (e) => {
    e.preventDefault();
    const new_values = values;
    setLoading(true);
    doc.sheetsByIndex[3].addRows([new_values]).then((data) => {
      console.log("data...", data);
      toast.success("Pole created successfully.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setValues({});
      // loadPoles();
      setLoading(false);
      router.back();
    });
  };

  const updatePole = (e) => {
    e.preventDefault();
    const list_of_form_fittings = form
      .filter((item) => item.label.includes("Type Of Fitting"))
      .map((item) => item.label);
    const list_of_form_wattage = form
      .filter((item) => item.label.includes("Wattage"))
      .map((item) => item.label);
    const new_values = {};
    Object.keys(values).map((item) => {
      if (item.includes("Type Of Fitting") || item.includes("Wattage")) {
        if (
          list_of_form_fittings.includes(item) ||
          list_of_form_wattage.includes(item)
        ) {
          new_values[item] = values[item];
        }
      } else {
        new_values[item] = values[item];
      }
    });
    if (
      Object.keys(new_values).length !== Object.keys(form).length &&
      Object.keys(new_values).length !== Object.keys(form).length - 1 &&
      values?.Remarks == ""
    ) {
      console.log("Please fill all the fields....");
      toast.warning("Please fill all the fields.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    setLoading(true);
    const row = poles?.find((row) => row._rowNumber == params.get("pole"));
    console.log(new_values, "values...");
    Object.keys(row.toObject()).map((item) => {
      row.assign({ [item]: "" });
    });
    row.assign(new_values);
    row.save().then((data) => {
      loadPoles();
      toast.success("Pole updated successfully.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      router.back();
    });
  };

  return (
    <div>
      <Head>
        <title>{isEditing ? "Edit Pole" : "New Pole"}</title>
      </Head>
      <div className="px-10 lg:px-[27%] bg-[#24282d]">
        <h2 className="text-2xl py-3 font-bold text-white">
          {isEditing ? "Edit" : "New"} Pole
        </h2>
      </div>
      <form className="mx-10 lg:mx-[27%]">
        {[...new Set(form.map((ele) => ele.category))].map((category) => (
          <Disclosure as="div" className="my-5" defaultOpen={!category || category == "Pole Details"}>
            <DisclosureButton className="group flex w-full items-center justify-between">
              <div className="text-md flex px-1 text-gray-700 justify-between w-full font-medium ">
                <h4>{category}</h4>
                {category && <FontAwesomeIcon className="ml-auto mt-1 text-gray-500" icon={faChevronDown} />}
              </div>
            </DisclosureButton>
            <DisclosurePanel transition className="px-3 border rounded my-1">
              {form.map(
                (item) =>
                  item.category == category &&
                  (item.type == "select" ? (
                    <SelectInput
                      label={item.label}
                      required
                      name={item.label}
                      value={{
                        label: values[item.label],
                        value: values[item.label],
                      }}
                      options={item.options}
                      onChange={(value) => {
                        if (item.label == "District") {
                          return setValues({
                            ...values,
                            "ULB Name": null,
                            "Ward No": null,
                            [item.label]: value.value,
                          });
                        } else if (item.label == "ULB Name") {
                          return setValues({
                            ...values,
                            "Ward No": null,
                            [item.label]: value.value,
                          });
                        }
                        return setValues({
                          ...values,
                          [item.label]: value.value,
                        });
                      }}
                    />
                  ) : (
                    <InputController
                      required
                      label={item.label}
                      type={item.type}
                      value={values[item.label]}
                      onChange={(e) =>
                        setValues({ ...values, [item.label]: e.target.value })
                      }
                    />
                  ))
              )}
            </DisclosurePanel>
          </Disclosure>
        ))}
      </form>
      <div className="px-10 mt-10 flex gap-5 py-5 bottom-0 border-t border-gray-300 w-full">
        <button
          disabled={loading}
          onClick={(e) => (isEditing ? updatePole(e) : createNewPole(e))}
          type="submit"
          className="bg-orange-600 py-2 text-md text-white font-bold rounded-lg px-5"
        >
          {loading ? "Saving..." : isEditing ? "Update" : "Submit"}
        </button>

        <button
          onClick={() => router.replace(`/pole?district=${params.get("district")}&ulb=${params.get("ulb")}&ward=${params.get("ward")}`)}
          className="border border-gray-400 py-2 text-md text-gray-800 font-bold rounded-lg px-5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Pole;
