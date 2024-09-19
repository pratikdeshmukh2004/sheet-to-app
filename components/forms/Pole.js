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
import axios from "axios";
import imageCompression from "browser-image-compression"; // Image compression library

import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Pole = ({ isEditing = null }) => {
  const { dataSheet, loadPoles, poles, doc, user } = useContext(DataContext);
  const [values, setValues] = useState({});
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [positoin, setPosition] = useState({ lat: "", long: "" });
  const [image, setImage] = useState(null);
  const MAX_RETRIES = 5; // Max retries for the upload
  let backURL = `/pole?district=${params.get("district")}&ulb=${params.get(
    "ulb"
  )}&ward=${params.get("ward")}`;
  if (isEditing) {
    backURL = `/pole?district=${values["District"]}&ulb=${values["ULB Name"]}&ward=${values["Ward No"]}`;
  }
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
      category: "Pole Details",
    },
    {
      type: "text",
      label: "Longitude",
      category: "Pole Details",
    },
    {
      type: "select",
      label: "New / Replace",
      category: "LED",
      options: dataSheet
        ?.filter((item) => item.get("New / Replace"))
        ?.map((item) => ({
          label: item.get("New / Replace"),
          value: item.get("New / Replace"),
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
    },
    {
      type: "select",
      label: "Make",
      category: "LED",
      options: dataSheet
        ?.filter((item) => item.get("Make"))
        ?.map((item) => ({
          label: item.get("Make"),
          value: item.get("Make"),
        })),
    },
    {
      type: "select",
      label: "Arm Type",
      category: "LED",
      options: dataSheet
        ?.filter((item) => item.get("Arm Type"))
        ?.map((item) => ({
          label: item.get("Arm Type"),
          value: item.get("Arm Type"),
        })),
    },
    {
      type: "select",
      label: "Arm Length",
      category: "LED",
      options: dataSheet
        ?.filter((item) => item.get("Arm Length"))
        ?.map((item) => ({
          label: item.get("Arm Length"),
          value: item.get("Arm Length"),
        })),
    },
    {
      type: "select",
      label: "CCMS/ Timer",
      category: "Feeder Panel",
      options: dataSheet
        ?.filter((item) => item.get("CCMS/ Timer"))
        ?.map((item) => ({
          label: item.get("CCMS/ Timer"),
          value: item.get("CCMS/ Timer"),
        })),
    },
    {
      type: "select",
      label: "CCMS Rating (KW)",
      category: "Feeder Panel",
      options: dataSheet
        ?.filter((item) => item.get("CCMS Rating (KW)"))
        ?.map((item) => ({
          label: item.get("CCMS Rating (KW)"),
          value: item.get("CCMS Rating (KW)"),
        })),
    },
    {
      type: "select",
      label: "Coil",
      category: "Feeder Panel",
      options: dataSheet
        ?.filter((item) => item.get("Coil"))
        ?.map((item) => ({
          label: item.get("Coil"),
          value: item.get("Coil"),
        })),
    },
    {
      type: "select",
      label: "GI Pipe",
      category: "Feeder Panel",
      options: dataSheet
        ?.filter((item) => item.get("GI Pipe"))
        ?.map((item) => ({
          label: item.get("GI Pipe"),
          value: item.get("GI Pipe"),
        })),
    },
    {
      type: "text",
      label: "Cable length New Installed (m)",
      category: "Cable",
    },
    {
      type: "select",
      label: "Cable type (OH/UG)",
      category: "Cable",
      options: dataSheet
        ?.filter((item) => item.get("Cable type (OH/UG)"))
        ?.map((item) => ({
          label: item.get("Cable type (OH/UG)"),
          value: item.get("Cable type (OH/UG)"),
        })),
    },
    {
      type: "select",
      label: "Cable Rating (Sq.mm)",
      category: "Cable",
      options: dataSheet
        ?.filter((item) => item.get("Cable Rating (Sq.mm)"))
        ?.map((item) => ({
          label: item.get("Cable Rating (Sq.mm)"),
          value: item.get("Cable Rating (Sq.mm)"),
        })),
    },
    {
      type: "select",
      label: "Suspension Clamp",
      category: "Cable",
      options: dataSheet
        ?.filter((item) => item.get("Suspension Clamp"))
        ?.map((item) => ({
          label: item.get("Suspension Clamp"),
          value: item.get("Suspension Clamp"),
        })),
    },
    {
      type: "select",
      label: "Dead End Clamp",
      category: "Cable",
      options: dataSheet
        ?.filter((item) => item.get("Dead End Clamp"))
        ?.map((item) => ({
          label: item.get("Dead End Clamp"),
          value: item.get("Dead End Clamp"),
        })),
    },
    {
      type: "select",
      label: "Eye-hook",
      category: "Cable",
      options: dataSheet
        ?.filter((item) => item.get("Eye-hook"))
        ?.map((item) => ({
          label: item.get("Eye-hook"),
          value: item.get("Eye-hook"),
        })),
    },
    {
      type: "select",
      label: "Piercing Connector",
      category: "Cable",
      options: dataSheet
        ?.filter((item) => item.get("Piercing Connector"))
        ?.map((item) => ({
          label: item.get("Piercing Connector"),
          value: item.get("Piercing Connector"),
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

  const handleFileUpload = async () => {
    if (!image) return;

    try {
      toast.info("Compressing file...");
      // Compress the image
      const options = {
        maxSizeMB: 5, // Set max size in MB
        useWebWorker: true, // Use multi-threading for compression
      };

      // Compress the image
      const compressedImage = await imageCompression(image, options);

      // Create a new File object to preserve the file name and type
      const compressedFile = new File([compressedImage], image.name, {
        type: image.type, // Keep the original MIME type
      });

      toast.info("Uploading file...");
      // Prepare form data with the compressed image file
      const formData = new FormData();
      formData.append("file", compressedFile);

      // Retry logic
      let attempts = 0;
      let success = false;
      let response = null;

      while (attempts < MAX_RETRIES && !success) {
        response = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (!response.error) {
          success = true;
          continue;
        }
        toast.error(`Error uploading file: ${response.error}`);
        attempts++;
        toast.info(`Retrying upload (${attempts}/${MAX_RETRIES})...`);

        // If max attempts are reached, throw an error
        if (attempts === MAX_RETRIES) {
          toast.error(`Max upload attempts reached.`);
        }
      }

      // If upload succeeds
      if (success) {
        setValues({ ...values, "Image URL": response.data.fileUrl });
        toast.success("File uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file after multiple attempts.");
    }
  };

  // Call this function in useEffect when values.Image changes
  useEffect(() => {
    handleFileUpload();
  }, [image]);

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
    new_values["Created By"] = user.email;
    setLoading(true);
    doc.sheetsByIndex[1].addRows([new_values]).then((data) => {
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
      router.replace(backURL);
    });
  };

  const updatePole = (e) => {
    e.preventDefault();
    setLoading(true);
    const row = poles?.find((row) => row._rowNumber == params.get("pole"));
    Object.keys(row.toObject()).map((item) => {
      // if (item == "Image URL") return;
      row.assign({ [item]: "" });
    });
    row.assign(values);
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
    });
    setLoading(false);
    router.replace(backURL);
  };

  return (
    <div>
      {loading && <Loader />}
      <Head>
        <title>{isEditing ? "Edit Pole" : "New Pole"}</title>
      </Head>
      <div className="px-5 lg:px-[27%] bg-[#24282d]">
        <h2 className="text-2xl py-3 font-bold text-white">
          {isEditing ? "Edit" : "New"} Pole
        </h2>
      </div>
      <form className="mx-3 lg:mx-[27%]">
        {[...new Set(form.map((ele) => ele.category))].map((category) => (
          <Disclosure
            as="div"
            className="my-5"
            defaultOpen={!category || category == "Pole Details"}
          >
            <DisclosureButton className="group flex w-full items-center justify-between">
              <div className="text-md flex px-1 text-gray-700 justify-between w-full font-medium ">
                <h4>{category}</h4>
                {category && (
                  <FontAwesomeIcon
                    className="ml-auto mt-1 text-gray-500"
                    icon={faChevronDown}
                  />
                )}
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
                      onChange={(e) => {
                        if (item.type == "file") {
                          setImage(e.target.files[0]);
                        }
                        setValues({
                          ...values,
                          [item.label]: e.target.value,
                        });
                      }}
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
          onClick={() => router.replace(backURL)}
          className="border border-gray-400 py-2 text-md text-gray-800 font-bold rounded-lg px-5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Pole;
