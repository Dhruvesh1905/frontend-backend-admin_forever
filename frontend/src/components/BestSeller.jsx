import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(()=>{
        const bestProduct = products.filter((item)=>(item.bestseller));
        setBestSeller(bestProduct.slice(0,5))
    
        if (bestProduct.length > 0) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "view_item_list",
              ecommerce: {
                item_list_name: "Best Sellers",
                items: bestProduct.map((item) => ({
                  item_id: item._id,
                  item_name: item.name,
                  item_category: item.category || "Uncategorized",            
                  item_category2: item.subCategory || "Uncategorized",
                  price: item.price,
                  currency: "INR",
                })),
              },
            });
      
            console.log("GTM view_item_list Triggered for Best Sellers");
        }    
    },[products])
  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={'BEST'}  text2={'SELLERS'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate, quasi!</p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>

            {
                bestSeller.map((item,index)=>(
                    <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} category={item.category} subCategory={item.subCategory}/>
                ))
            }

        </div>
      
    </div>
  )
}

export default BestSeller


