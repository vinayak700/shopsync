import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../config/firebaseInit";
import { useAuthValue } from "./authContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    writeBatch,
} from "firebase/firestore";

// Creating productContext
const productContext = createContext();

// Creating Custom hook for exporting product values
export const useProductValue = () => useContext(productContext);

const ProductContext = ({ children }) => {
    const { currentUser } = useAuthValue();
    // Initializing Multiple states for product inventory
    const [products, setProducts] = useState([]);
    const [userCart, setUserCart] = useState([]);
    const [userOrder, setUserOrder] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [loading, setLoading] = useState(false);

    // Getting dates
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();

    // Find minimum and maximum prices
    useEffect(() => {
        const calculateThreshold = () => {
            // Fetching prices of all products & find min & max among it
            const prices = products.map((item) => item.price);
            setMinPrice(Math.min(...prices));
            setMaxPrice(Math.max(...prices));
        };
        if (products.length > 0) {
            calculateThreshold();
        }
    }, [products]);

    // **** Fetching all database Products ****
    const getAllProducts = () => {
        setLoading(true);
        try {
            //    Creating collection reference
            const collectionRef = collection(db, "products");
            // const q = query(collectionRef, orderBy("addedDate", "desc"));
            onSnapshot(collectionRef, (querySnapShot) => {
                const newProducts = [];
                querySnapShot.forEach((doc) => {
                    newProducts.push({ id: doc.id, ...doc.data() })
                });
                setProducts(newProducts);
            });
        } catch (error) {
            console.log(error);
            toast.error("Error in Fetching Products");
        }
        setLoading(false);
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    // **** Add a new product ****
    const addProduct = async (name, price, category, imageUrl) => {
        try {
            await addDoc(collection(db, "products"), {
                name,
                category,
                price: Number(price),
                imageUrl,
                addedDate: currentDate,
            });
            toast.success("Product added successfully");
        } catch (error) {
            console.log(error);
            toast.error("Error in adding product");
        }
    };

    // **** Add To Cart ****
    const addToUserCart = async (product) => {
        try {
            if (!currentUser) {
                toast.error("Please Login first!!!");
                return;
            }
            // Check if the Product is already in the cart
            const cartDocRef = doc(
                db,
                `usersCarts/${currentUser.uid}/myCart`,
                product.id
            );
            const cartDocSnap = await getDoc(cartDocRef);
            if (cartDocSnap.exists()) {
                await setDoc(cartDocRef, { quantity: increment(1) }, { merge: true });
                console.log('created successfully');
                toast.success("Product quantity increased by 1");
            } else {
                // if product not found, add a new one with quantity of 1
                await setDoc(cartDocRef, { quantity: 1, ...product });
                toast.success("Product added to Cart");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error adding Product to Cart");
        }
    };

    // **** Remove From Cart ****
    const decCartItemQty = async (productId) => {
        try {
            // If user is not logged in
            if (!currentUser) {
                toast.error("Please Login first!!!");
                return;
            }
            //Find the product in the Cart
            const cartDocRef = doc(
                db,
                `usersCarts/${currentUser.uid}/myCart`,
                productId
            );
            const cartDocSnap = await getDoc(cartDocRef);
            if (cartDocSnap.exists()) {
                const currentQty = cartDocSnap.data().quantity;
                if (currentQty > 1) {
                    // if current product qty in cart is greater than 1, decrease the qty
                    await setDoc(
                        cartDocRef,
                        { quantity: increment(-1) },
                        { merge: true }
                    );
                    toast.success("Product quantity decreased by 1");
                } else {
                    //Otherwise
                    await deleteDoc(cartDocRef);
                    toast.success("Product removed from Cart");
                }
            }
        } catch (error) {
            toast.error("Error in removing product from Cart");
            console.log(error);
        }
    };

    // **** Remove from Cart ****
    const removeFromUserCart = async (productId) => {
        try {
            if (!currentUser) {
                toast.error("Please Login first!!!");
                return;
            }
            const cartDocRef = doc(
                db,
                `usersCarts/${currentUser.uid}/myCart`,
                productId
            );
            await deleteDoc(cartDocRef);
            toast.success('Product removed from the Cart successfully')
        } catch (error) {
            console.log(error);
            toast.error('Error in removing cart Item');
        }
    }

    // **** Getting User Cart Items ****
    const getUserCartItems = async () => {
        setLoading(true);
        try {
            const cartCollRef = collection(db, `usersCarts/${currentUser.uid}/myCart`);
            // Update Cart items in real time
            onSnapshot(cartCollRef, (querySnapShot) => {
                const newCart = [];
                querySnapShot.forEach((item) => {
                    newCart.push({ id: item.id, ...item.data() })
                });
                setUserCart(newCart);
            });
        } catch (error) {
            toast.error("Error getting user's Cart");
            console.log(error);
            return [];
        }
        setLoading(false);
    };

    // **** Placing an order from the Cart ****
    const placeOrder = async () => {
        try {
            let orderDate =
                date.toString() + "-" + month.toString() + "-" + year.toString();
            let newOrder = { userCart, orderDate };
            // creating a new order
            const orderCollRef = collection(
                db,
                `userOrders/${currentUser.uid}/orders`
            );
            await setDoc(doc(orderCollRef), newOrder);
            // Clearing cart after placing order
            toast.success("Order placed successfully!");
            clearUserCart();
        } catch (error) {
            console.log(error);
            toast.error("Error in Placing Order");
        }
    };

    // **** Fetching User order history ****
    const getUserOrderHistory = async () => {
        setLoading(true);
        try {
            // Database Reference to my placed orders
            const orderCollRef = collection(
                db,
                `userOrders/${currentUser.uid}/orders`
            );
            // Sort by orderDate in descending order
            const q = query(orderCollRef, orderBy("orderDate", "desc"));
            onSnapshot(q, (querySnapShot) => {
                const newOrderHistory = [];
                querySnapShot.forEach((doc) => {
                    newOrderHistory.push({ id: doc.id, ...doc.data() })
                });
                setUserOrder(newOrderHistory);
            });
        } catch (error) {
            console.log(error);
            toast.error("Error in Fetching Orders");
        }
        setLoading(false);
    };

    // clear the user cart in the "carts" subcollection
    const clearUserCart = async () => {
        try {
            const cartCollRef = collection(db, `userCarts/${currentUser.uid}/myCart`);
            const cartQuerySnapShot = await getDocs(cartCollRef);
            const batch = writeBatch(db);
            cartQuerySnapShot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            setUserCart([]);
        } catch (error) {
            console.log(error);
            toast.error("Error in clearing cart items");
        }
    };

    const cartTotal = (userOrder) => {
        return userOrder.reduce(
            (total, product) => total + product.price * product.quantity,
            0
        );
    };

    return (
        <productContext.Provider
            value={{
                products,
                addProduct,
                addToUserCart,
                removeFromUserCart,
                decCartItemQty,
                maxPrice,
                minPrice,
                cartTotal,
                userCart,
                getUserCartItems,
                clearUserCart,
                userOrder,
                placeOrder,
                getUserOrderHistory,
                loading,
            }}
        >
            {children}
        </productContext.Provider>
    );
};

export default ProductContext;