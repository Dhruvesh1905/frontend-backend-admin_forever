import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";


const Footer = () => {
  const navigate = useNavigate();

  const handleBottomNavClick = (title, route) => {
    const user_id = localStorage.getItem("user_id") || "guest";
    const user_status = localStorage.getItem("user_status") || "logged_out";

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "bottom_navigation_click",
      element_title: title,
      user_id: user_id,
      user_status: user_status,
    });

    navigate(route);
  };


  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm bg-black p-10 border rounded-xl">
        <div>
          <div className="w-max bg-gradient-to-r from-pink-100 to-pink-200 mb-5 border rounded-tl-3xl rounded-tr-none rounded-bl-none rounded-br-3xl">
            <img src={assets.logo} className="p-1 pt-2.5 w-40" alt="" />
          </div>
          <p className="w-full md:w-2/3 text-gray-50">
            Experience seamless shopping with our exclusive collection of
            premium products. Discover top deals, enjoy hassle-free delivery,
            and shop with confidence every time. Stay ahead with the latest
            trends and unbeatable prices—your satisfaction is our priority.
          </p>
        </div>
        <div className="text-gray-50">
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1">
            <li className="cursor-pointer hover:underline"
              onClick={() => handleBottomNavClick("Home", "/")}>Home</li>
            <li className="cursor-pointer hover:underline"
              onClick={() => handleBottomNavClick("About us", "/about")}>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="text-gray-50">
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1">
            <li>+1-213-456-7890</li>
            <li>support@forvinity.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          {" "}
          Copyright 2024@ forvinity.com - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
