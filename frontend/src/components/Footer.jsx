import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm bg-black p-10 border rounded-xl">
        <div>
        <div className="w-max bg-white mb-5 border rounded-tl-3xl rounded-tr-none rounded-bl-none rounded-br-3xl">
            <img src={assets.logo} className= "p-3 w-40" alt="" />
          </div>
          <p className="w-full md:w-2/3 text-gray-50">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
            quibusdam expedita consectetur earum commodi explicabo laboriosam
            itaque, alias recusandae nobis.Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Dolorum, sunt.
          </p>
        </div>
        <div className="text-gray-50">
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="text-gray-50">
            <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-1">
                <li>+1-213-456-7890</li>
                <li>support@forever.com</li>
            </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center"> Copyright 2024@ forever.com - All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
