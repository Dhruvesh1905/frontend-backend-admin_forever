import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Profile from "./pages/Profile";

const App = () => {
  const location = useLocation();
  const [prevPath, setPrevPath] = useState("");


  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "page_view",
      virtual_page_title: document.title,
      virtual_page_location: window.location.href,
      virtual_page_referrer: prevPath, // Use stored previous path
    });

    console.log("GTM Pageview Triggered:", {
      page_path: location.pathname,
      virtual_page_title: document.title,
      virtual_page_location: window.location.href,
      virtual_page_referrer: prevPath,
    });

    // Update previous path for next navigation
    setPrevPath(window.location.href);
  }, [location]);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
      <Footer />
    </div>
  );
};

export default App;
