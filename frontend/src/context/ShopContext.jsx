import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 250;

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const [cartItems, setCartItems] = useState({});

    const [products, setProducts] = useState([]);

    const [token, setToken] = useState('');

    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        // add_to_cart event:
        const productData = products.find((product) => product._id === itemId);
    
        if (productData) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: "add_to_cart",
                ecommerce: {
                    currency: "INR",
                    value: productData.price,
                    items: [
                        {
                            item_id: productData._id,
                            item_name: productData.name,
                            price: productData.price,
                            item_category: productData.category || "Uncategorized",
                            item_category2: productData.subCategory || "Unknown",
                            item_variant: size, 
                            quantity: 1, 
                        },
                    ],
                },
            });
        }


        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', {itemId,size}, {headers: {token}})
            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    toast.error(error);
                }
            }
        }
        return totalCount;
    }

    // const updateQuantity = async (itemId, size, quantity) => {
    //     let cartData = structuredClone(cartItems);
    //     cartData[itemId][size] = quantity;
    //     setCartItems(cartData);

    //     if (token) {
    //         try {
    //             await axios.post(backendUrl + '/api/cart/update', {itemId,size,quantity}, {headers:{token}});                

    //         } catch (error) {
    //             console.log(error);
    //             toast.error(error.message)
    //         }
    //     }
    // }

// ====================================================================
    // add_to_cart and remove_from_cart updateQuantity() function:

    const updateQuantity = async (itemId, size, newQuantity) => {
        let cartData = structuredClone(cartItems);
        let existingQuantity = cartData[itemId][size] || 0;  // Get current quantity
        let quantityDifference = newQuantity - existingQuantity; // Calculate change
    
        if (quantityDifference > 0) {
            // Quantity increased → fire add_to_cart
            window.dataLayer.push({
                event: "add_to_cart",
                ecommerce: {
                    currency: "INR",
                    value: products.find((p) => p._id === itemId).price * quantityDifference,
                    items: [
                        {
                            item_id: itemId,
                            item_name: products.find((p) => p._id === itemId).name,
                            price: products.find((p) => p._id === itemId).price,
                            item_category: products.find((p) => p._id === itemId).category || "Uncategorized",
                            item_category2: products.find((p) => p._id === itemId).subCategory || "Unknown",
                            item_variant: size,
                            quantity: quantityDifference, // Only added units
                        },
                    ],
                },
            });
        } else if (quantityDifference < 0) {
            // Quantity decreased → fire remove_from_cart
            window.dataLayer.push({
                event: "remove_from_cart",
                ecommerce: {
                    currency: "INR",
                    value: products.find((p) => p._id === itemId).price * Math.abs(quantityDifference),
                    items: [
                        {
                            item_id: itemId,
                            item_name: products.find((p) => p._id === itemId).name,
                            price: products.find((p) => p._id === itemId).price,
                            item_category: products.find((p) => p._id === itemId).category || "Uncategorized",
                            item_category2: products.find((p) => p._id === itemId).subCategory || "Unknown",
                            item_variant: size,
                            quantity: Math.abs(quantityDifference), // Only removed units
                        },
                    ],
                },
            });
        }
    
        // Update state and backend
        if (newQuantity > 0) {
            cartData[itemId][size] = newQuantity;
        } else {
            delete cartData[itemId][size]; // Remove size if quantity is 0
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId]; // Remove item if no sizes left
            }
        }
    
        setCartItems(cartData);
    
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity: newQuantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };
    
    // Remove Item from cart function to push dataLayer() on bin_icon click:
    const removeItemFromCart = async (itemId, size) => {
        let cartData = structuredClone(cartItems);
        let existingQuantity = cartData[itemId][size] || 0; 
    
        if (existingQuantity > 0) {
            window.dataLayer.push({
                event: "remove_from_cart",
                ecommerce: {
                    currency: "INR",
                    value: products.find((p) => p._id === itemId).price * existingQuantity,
                    items: [
                        {
                            item_id: itemId,
                            item_name: products.find((p) => p._id === itemId).name,
                            price: products.find((p) => p._id === itemId).price,
                            item_category: products.find((p) => p._id === itemId).category || "Uncategorized",
                            item_category2: products.find((p) => p._id === itemId).subCategory || "Unknown",
                            item_variant: size,
                            quantity: existingQuantity, // Remove full quantity
                        },
                    ],
                },
            });
        }
    
        // Remove item from state
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
            delete cartData[itemId]; // Remove item if no sizes left
        }
    
        setCartItems(cartData);
    
        if (token) {
            try {
                await axios.post(backendUrl + "/api/cart/update", { itemId, size, quantity: 0 }, { headers: { token } }); 
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };
    

    const getCartAmount = () => {
        let totalAmount = 0; 

        for(const items in cartItems){
            let itemInfo = products.find((product)=>product._id === items);
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')

            if(response.data.success){
                setProducts(response.data.products)
            }
            else{
                toast.error(response.data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
    }   

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers:{token}});

            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }
    useEffect(() => {
        getProductsData()
    },[])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    },[])
   
    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity, removeItemFromCart,
        getCartAmount,navigate, backendUrl,
        setToken, token
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;