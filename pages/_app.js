import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import sheetApiContext from "../Context/sheetApiContext";
import { useEffect, useState } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import DataContext from "@/Context/dataContext";
import Loader from "@/components/loader";
import { ToastContainer } from "react-toastify";
export default function App({ Component, pageProps }) {
  const [doc, setDoc] = useState(null);
  const [areaCodes, setAreaCodes] = useState(null);
  const [poles, setPoles] = useState(null);

  const loadDoc = async () => {
    console.log("Loading doc and data...");
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(
      "1i3yy7N6G92PEJweCImkdiC4-BkvY7WGoPVXn6ldNQTg",
      serviceAccountAuth
    );
    await doc.loadInfo();
    setDoc(doc);
    doc.sheetsByIndex[0].getRows().then((data) => {
      setAreaCodes(data);
      console.log("Datasheet loaded: ", data);
    });
    doc.sheetsByIndex[1].getRows().then((data) => {
      setPoles(data);
      console.log("Poles loaded: ", data);
    });
  };

  const loadPoles = async () => {
    doc.sheetsByIndex[1].getRows().then((data) => {
      setPoles(data);
    });
  };

  useEffect(() => {
    loadDoc();
  }, []);

  if (!doc) return <Loader />;
  
  return (
    <sheetApiContext.Provider value={{ doc, setDoc }}>
      <DataContext.Provider
        value={{ areaCodes, poles, setPoles, setAreaCodes, loadPoles, doc }}
      >
        <ToastContainer />
        <Component {...pageProps} />
      </DataContext.Provider>
    </sheetApiContext.Provider>
  );
}
