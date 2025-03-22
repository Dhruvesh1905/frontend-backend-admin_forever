import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from "react-router-dom"; 
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({category, subCategory}) => {

    const {products} = useContext(ShopContext);

    const [related, setRelated] = useState([]);

    const location = useLocation();
    

    useEffect(()=>{
        if (products.length > 0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item)=>category === item.category);
            productsCopy = productsCopy.filter((item)=> subCategory === item.subCategory);

            setRelated(productsCopy.slice(0,5));
            
        }
    },[products])

    useEffect(() => {
      if (related.length > 0) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "view_item_list",
          ecommerce: {
            item_list_name: "Related Products",
            items: related.map((item, index) => ({
              item_id: item._id,
              item_name: item.name,
              item_category: category || "Uncategorized",
              item_category2: subCategory || "Uncategorized",
              index: index + 1,
              price: item.price,
              currency: "INR",
            })),
          },
        });
  
        console.log("GTM view_item_list Triggered for Related Products on PDP change");
      }
    }, [related, location.pathname]);
    
  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'}/>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.map((item, index)=>(
            <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} category={item.category} subCategory={item.subCategory}/>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts

