import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import TagManager from "react-gtm-module";
import { useEffect } from "react";



const tagManagerArgs = {
  gtmId: "GTM-PG5W357S", 
};

function Main() {
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []); 

  return (
    <BrowserRouter>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<Main />);
