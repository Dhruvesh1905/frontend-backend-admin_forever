import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(()=>{
    const slicedProducts = products.slice(0, 10);
    setLatestProducts(slicedProducts);
  
    if (slicedProducts.length > 0) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "view_item_list",
        ecommerce: {          
          item_list_name: "Latest Collection",
          items: slicedProducts.map((item, index) => ({
            item_id: item._id,
            item_name: item.name,
            item_category: item.category || "Uncategorized",            
            item_category2: item.subCategory || "Uncategorized",
            index: index + 1,
            price: item.price,
            currency: "INR",
          })),
        },
      });
  
      console.log("GTM view_item_list Triggered for Latest Collection");
    }  
  },[products])

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam,
          adipisci?
        </p>
      </div>

      {/* Products Rendering */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {
            latestProducts.map((item, index)=>(
                <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} category={item.category} subCategory={item.subCategory} />
            ))
        }

      </div>
    </div>
  );
};

export default LatestCollection;
