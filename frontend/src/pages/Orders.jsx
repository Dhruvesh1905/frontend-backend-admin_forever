import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { currency, backendUrl, token } = useContext(ShopContext);

  const [orderData, setorderData] = useState([]);

  const [firedTransactions, setFiredTransactions] = useState(new Set());

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        let allOrdersItem = [];

        let processedOrders =
          JSON.parse(localStorage.getItem("processedOrders")) || [];

        console.log(response.data.orders);

        response.data.orders.map((order) => {
          // Assigning correct transaction_id based on payment method
          let transactionId = order._id;

          order.items.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            item["orderId"] = order._id || "OrderId not fetched";
            item["amount"] = order.amount;
            item["transaction_id"] = transactionId;
            allOrdersItem.push(item);
          });
          if (!processedOrders.includes(transactionId)) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "purchase",
              ecommerce: {
                transaction_id: transactionId,
                value: order.amount,
                currency: "INR",
                tax: order.tax || 0,
                shipping: order.shipping || 250,
                payment_type: order.paymentMethod.toLowerCase(),
                items: order.items.map((item) => ({
                  item_id: item._id,
                  item_name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  item_variant: item.size,
                  item_category: item.category || "Uncategorized",
                  item_category2: item.subCategory || "Unknown",
                })),
              },
            });

            processedOrders.push(transactionId); // Save this transaction ID
            localStorage.setItem(
              "processedOrders",
              JSON.stringify(processedOrders)
            ); // Update localStorage
          }
        });
        setorderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);
  return (
    <div className="border-t pt-16">
      {orderData.length > 0 && (
        <div className="flex flex-col items-center justify-center mt-5 mb-8">
          {/* Thank You Title */}
          <Title
            text1="THANK"
            text2="YOU"
            className="text-4xl font-extrabold text-green-600"            
          />
          {/* Subtext */}
          <p className="text-2xl sm:text-xl font-medium text-gray-600 mt-2 italic">
            Visit Again!
          </p>                    
        </div>
      )}

      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p>
                    {currency}
                    {item.price}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size} </p>
                </div>
                <p className="mt-1">
                  Date:{" "}
                  <span className="text-gray-400">
                    {new Date(item.date).toDateString()}
                  </span>
                </p>
                <p className="mt-1">
                  Payment:{" "}
                  <span className="text-gray-400">{item.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <button
                onClick={loadOrderData}
                className="border px-4 py-2 text-sm font-medium rounded-sm"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
