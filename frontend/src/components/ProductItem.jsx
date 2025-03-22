import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({id, image, name, price, category, subCategory }) => {

    const {currency} = useContext(ShopContext);

    //  Function to push select_item event when a user clicks a product
    const handleSelectItem = () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "select_item",
        ecommerce: {
          items: [
            {
              item_id: id,
              item_name: name,
              item_category: category || "Uncategorized",
              item_category2: subCategory || "Uncategorized",
              price: price,
              currency: "INR",
            }
          ]
        }
      });

      console.log(`GTM select_item Triggered for: ${name}`);
    };


  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`} onClick={handleSelectItem}>
        <div className='overflow-hidden'>
            <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt="" />
        </div>
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm font-medium'>{currency}{price}</p>      
    </Link>
  )
}

export default ProductItem
