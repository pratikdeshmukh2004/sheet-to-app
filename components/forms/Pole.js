import SelectInput from "./SelectController";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import DataContext from "@/Context/dataContext";
import { useSearchParams } from "next/navigation";
import InputController from "./InputController";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Loader from "../loader";
const Pole = ({ isEditing = null }) => {
  const { areaCodes, loadPoles, poles, doc } = useContext(DataContext);
  const [values, setValues] = useState({});
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [positoin, setPosition] = useState({ lat: "", long: "" });
  const [form, setForm] = useState([
    {
      type: "select",
      label: "Area Code",
      options: areaCodes
        ?.filter((item) => item.get("Area Code"))
        ?.map((item) => ({
          label: item.get("Area Code"),
          value: item.get("Area Code"),
        })),
    },
    {
      type: "select",
      label: "Switch No.",
      options: areaCodes
        ?.filter(
          (item) =>
            item.get("Area Code For Switch") &&
            item.get("Area Code For Switch") == values["Area Code"]
        )
        ?.map((item) => ({
          label: item.get("Switch No."),
          value: item.get("Switch No."),
        })),
    },
    {
      type: "number",
      label: "Ward No.",
    },
    {
      type: "number",
      label: "Pole No.",
    },
    {
      type: "text",
      label: "Road/Street Name",
    },
    {
      type: "select",
      label: "Road Type",
      options: areaCodes
        ?.filter((item) => item.get("Road Types"))
        ?.map((item) => ({
          label: item.get("Road Types"),
          value: item.get("Road Types"),
        })),
    },
    {
      type: "number",
      label: "Road Width",
    },
    {
      type: "select",
      label: "Type Of Pole",
      options: areaCodes
        ?.filter((item) => item.get("Type Of Pole"))
        ?.map((item) => ({
          label: item.get("Type Of Pole"),
          value: item.get("Type Of Pole"),
        })),
    },
    {
      type: "number",
      label: "Pole Height",
    },
    {
      type: "number",
      label: "Fitting Height",
    },
    {
      type: "select",
      label: "Arms",
      options: areaCodes
        ?.filter((item) => item.get("Arms"))
        ?.map((item) => ({
          label: item.get("Arms"),
          value: item.get("Arms"),
        })),
    },
    {
      type: "text",
      label: "Lattitude",
    },
    {
      type: "text",
      label: "Longitude",
    },

    {
      type: "text",
      label: "Remarks",
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
      prefilled["Area Code"] = params.get("area");
      prefilled["Switch No."] = params.get("switch");
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
        options: areaCodes
          ?.filter((item) => item.get("Type Of Fiting"))
          ?.map((item) => ({
            label: item.get("Type Of Fiting"),
            value: item.get("Type Of Fiting"),
          })),
      });
      filteredForm.push({
        type: "select",
        label: `Wattage ${i}`,
        options: areaCodes
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
      <div className="px-10 lg:px-[27%] bg-[#24282d]">
        <h2 className="text-2xl py-3 font-bold text-white">
          {isEditing ? "Edit" : "New"} Pole
        </h2>
      </div>
      <form onSubmit={(e) => createNewPole(e)} className="mx-10 lg:mx-[27%]">
        {form.map((item) =>
          item.type == "select" ? (
            <SelectInput
              label={item.label}
              required
              name={item.label}
              value={{ label: values[item.label], value: values[item.label] }}
              options={item.options}
              onChange={(value) =>
                setValues({ ...values, [item.label]: value.value })
              }
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
          )
        )}
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
          onClick={() => router.back()}
          className="border border-gray-400 py-2 text-md text-gray-800 font-bold rounded-lg px-5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Pole;
