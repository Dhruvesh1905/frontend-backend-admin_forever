import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { useLocation } from "react-router-dom";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    removeItemFromCart,
    navigate,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  // ========================== Currently Not working ======================================

  // Firing the view_cart event

  const location = useLocation();
  const [lastCartState, setLastCartState] = useState(null);

  useEffect(() => {
    if (location.pathname === "/cart" && cartData.length > 0) {
      const formattedItems = cartData.map((item) => {
        const productData = products.find((p) => p._id === item._id);
        return {
          item_id: productData._id,
          item_name: productData.name,
          price: productData.price,
          item_category: productData.category || "Uncategorized",
          item_category2: productData.subCategory || "Unknown",
          item_variant: item.size,
          quantity: item.quantity,
        };
      });

      // Calculate total cart value
      const totalValue = formattedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const newCartState = JSON.stringify({
        items: formattedItems,
        value: totalValue,
      });

      if (lastCartState !== newCartState) {
        window.dataLayer.push({
          event: "view_cart",
          ecommerce: {
            currency: "INR",
            value: totalValue,
            items: formattedItems,
          },
        });

        setLastCartState(newCartState);
      }
    }
  }, [location.pathname, cartData]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img className="w-16 sm:w-20" src={productData.image[0]} />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
              />
              {/* <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt=""
              /> */}

              {/* updated function to push remove_from_cart event */}
              <img
                onClick={() => removeItemFromCart(item._id, item.size)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="Remove"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            {/* <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              {" "}
              PROCEED TO CHECKOUT
            </button> */}

            {/* Firing begin_checkout event */}
            <button
              onClick={() => {
                // Fire begin_checkout event
                if (cartData.length > 0) {
                  const formattedItems = cartData.map((item) => {
                    const productData = products.find(
                      (p) => p._id === item._id
                    );
                    return {
                      item_id: productData._id,
                      item_name: productData.name,
                      price: productData.price,
                      item_category: productData.category || "Uncategorized",
                      item_category2: productData.subCategory || "Unknown",
                      item_variant: item.size,
                      quantity: item.quantity,
                    };
                  });

                  window.dataLayer.push({
                    event: "begin_checkout",
                    ecommerce: {
                      currency: "INR",
                      value:
                        formattedItems.reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        ) + 250,
                      items: formattedItems,
                    },
                  });
                }

                // Navigate to checkout page
                navigate("/place-order");
              }}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
