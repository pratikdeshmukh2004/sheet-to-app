import DataContext from "@/Context/dataContext";
import Loader from "@/components/loader";
import "@/styles/globals.css";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import sheetApiContext from "../Context/sheetApiContext";
export default function App({ Component, pageProps }) {
  const [doc, setDoc] = useState(null);
  const [dataSheet, setDataSheet] = useState(null);
  const [poles, setPoles] = useState(null);

  const loadDoc = async () => {
    console.log("Loading doc and data...");
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(
      "17nY1MKZEHCpWJU3zcx9hikSKUKdz7MuWm_Y4mE9fN0M",
      serviceAccountAuth
    );
    await doc.loadInfo();
    setDoc(doc);
    doc.sheetsByIndex[1].getRows().then((data) => {
      setDataSheet(data);
      console.log("Datasheet loaded: ", data);
    });
    // doc.sheetsByIndex[1].getRows().then((data) => {
    //   setPoles(data);
    //   console.log("Poles loaded: ", data);
    // });
  };

  const loadPoles = async () => {
    doc.sheetsByIndex[3].getRows().then((data) => {
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
        value={{ dataSheet, poles, setPoles, setDataSheet, loadPoles, doc }}
      >
        <ToastContainer />
        <Component {...pageProps} />
      </DataContext.Provider>
    </sheetApiContext.Provider>
  );
}
