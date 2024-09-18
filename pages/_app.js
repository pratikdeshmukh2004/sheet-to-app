import DataContext from "@/Context/dataContext";
import Loader from "@/components/loader";
import "@/styles/globals.css";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sheetApiContext from "../Context/sheetApiContext";
import { useRouter } from "next/router";
export default function App({ Component, pageProps }) {
  const [doc, setDoc] = useState(null);
  const [dataSheet, setDataSheet] = useState(null);
  const [poles, setPoles] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const loadDoc = async () => {
    console.log("Loading doc and data...");
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SPREADSHEET_ID,
      serviceAccountAuth
    );
    await doc.loadInfo();
    setDoc(doc);
    doc.sheetsByIndex[0].getRows().then((data) => {
      setDataSheet(data);
      console.log("Datasheet loaded: ", data);
    });
    doc.sheetsByIndex[1].getRows().then((data) => {
      setPoles(data);
      console.log("Poles loaded: ", data);
    });
  };

  const Authorize = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user && router.asPath !== "/auth/login") {
      router.replace("/auth/login");
    } else {
      loadDoc();
      setUser(user);
    }
  };

  const loadPoles = async () => {
    doc.sheetsByIndex[1].getRows().then((data) => {
      setPoles(data);
    });
  };

  useEffect(() => {
    Authorize();
  }, []);

  if (!doc && router.asPath !== "/auth/login") return <Loader />;

  return (
    <sheetApiContext.Provider value={{ doc, setDoc }}>
      <DataContext.Provider
        value={{
          dataSheet,
          poles,
          setPoles,
          setDataSheet,
          loadPoles,
          doc,
          user,
        }}
      >
        <ToastContainer />
        <Component {...pageProps} />
      </DataContext.Provider>
    </sheetApiContext.Provider>
  );
}
