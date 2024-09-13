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
      category: "Pole Details",
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
      type: "select",
      label: "Old / New",
      category: "Pole Details",
      options: dataSheet
        ?.filter((item) => item.get("Old / New"))
        ?.map((item) => ({
          label: item.get("Old / New"),
          value: item.get("Old / New"),
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
      category: "Pole Detail"
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
    console.log(values, "here.....");
    const arms = parseInt(values["Arms"]);
    const filteredForm = form.filter(
      (item) =>
        !item.label.includes("Type Of Fitting") &&
        !item.label.includes("Wattage")
    );
    for (let i = 1; i < arms + 1; i++) {
      filteredForm.push({
        type: "select",
        label: `Type Of Fitting ${i}`,
        options: dataSheet
          ?.filter((item) => item.get("Type Of Fiting"))
          ?.map((item) => ({
            label: item.get("Type Of Fiting"),
            value: item.get("Type Of Fiting"),
          })),
      });
      filteredForm.push({
        type: "select",
        label: `Wattage ${i}`,
        options: dataSheet
          ?.filter(
            (item) =>
              item.get("Wattage") &&
              item.get("Type Of Fitting For Wattage") ===
                values[`Type Of Fitting ${i}`]
          )
          ?.map((item) => ({
            label: item.get("Wattage"),
            value: item.get("Wattage"),
          })),
      });
    }
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
    console.log(values, "pole....");
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
      poles.filter(
        (item) =>
          item.get("Pole No.") == values["Pole No."] &&
          item.get("Switch No.") == values["Switch No."] &&
          item.get("Area Code") == values["Area Code"]
      ).length > 0
    ) {
      return toast.warning("Pole No. already exists.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
    if (Object.keys(new_values).length == 0) return;
    if (Object.keys(new_values).length !== Object.keys(form).length) {
      console.log("Please fill all the fields....");
      return toast.warning("Please fill all the fields.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setLoading(true);
    doc.sheetsByIndex[1].addRow(new_values).then((data) => {
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
      loadPoles();
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
      <form onSubmit={(e) => createNewPole(e)} className="mx-10 lg:mx-[27%]">
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
