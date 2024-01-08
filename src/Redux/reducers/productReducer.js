import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
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
import { db } from "../../config/firebaseInit";

// Getting dates
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const date = currentDate.getDate();

const initialState = {
  products: [],
  userCart: [],
  userOrder: [],
  minPrice: 0,
  maxPrice: 0,
  loading: false,
  cartTotal: 0,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, thunkAPI) => {
    try {
      // Creating collection reference
      const collectionRef = collection(db, "products");
      const querySnapShot = await getDocs(collectionRef);
      const newProducts = [];
      querySnapShot.forEach((doc) => {
        newProducts.push({ id: doc.id, ...doc.data() });
      });
      return newProducts;
    } catch (error) {
      console.error(error);
    }
  }
);

// Aynchronous function reducers
export const addToUserCart = createAsyncThunk(
  "product/addToUserCart",
  async (payload, thunkAPI) => {
    console.log(payload);
    const { product, currentUser } = payload;
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
        toast.success("Product quantity increased by 1");
        return;
      } else {
        // if product not found, add a new one with quantity of 1
        await setDoc(cartDocRef, { quantity: 1, ...product });
        toast.success("Product added to Cart");
        return;
      }
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue({ error });
    }
  }
);
export const decCartItemQty = createAsyncThunk(
  "product/decCartItemQty",
  async (payload, thunkAPI) => {
    const { productId, currentUser } = payload;
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
          return;
        } else {
          //Otherwise
          await deleteDoc(cartDocRef);
          toast.success("Product removed from the Cart");
          return;
        }
      }
    } catch (error) {
      toast.error("Error in removing product from Cart");
      return thunkAPI.rejectWithValue({ error });
    }
  }
);

export const removeFromUserCart = createAsyncThunk(
  "product/removeFromUserCart",
  async (payload, thunkAPI) => {
    const { productId, currentUser } = payload;
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
      toast.success("Product removed from the Cart successfully");
      return;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue({ error });
    }
  }
);

export const getUserCartItems = createAsyncThunk(
  "product/getUserCartItems",
  async (payload, thunkAPI) => {
    const { currentUser } = payload;
    try {
      const cartCollRef = collection(
        db,
        `usersCarts/${currentUser.uid}/myCart`
      );
      // Create a promise to resolve with the cart items
      return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(
          cartCollRef,
          (querySnapShot) => {
            const newCart = [];
            querySnapShot.forEach((item) => {
              newCart.push({ id: item.id, ...item.data() });
            });
            // Unsubscribe from the snapshot listener
            unsubscribe();
            // Resolve the promise with the newCart array
            resolve(newCart);
          },
          (error) => {
            // Reject the promise with the error if there's an issue
            reject(error);
          }
        );
      });
    } catch (error) {
      toast.error("Error getting user's Cart");
      console.log(error);
      // Return an empty array in case of an error
      return [];
    }
  }
);

export const placeOrder = createAsyncThunk(
  "product/placeOrder",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const { userCart } = state.productReducer;
    console.log(state.productReducer, initialState.userCart);
    const { currentUser } = payload;
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
      toast.success("Order placed successfully!");
      // thunkAPI.dispatch(clearUserCart({ currentUser }));
      return;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error });
    }
  }
);

export const clearUserCart = createAsyncThunk(
  "product/clearUserCart",
  async (payload, thunkAPI) => {
    const { currentUser } = payload;
    try {
      const cartCollRef = collection(
        db,
        `usersCarts/${currentUser.uid}/myCart`
      );
      console.log(cartCollRef);
      const cartQuerySnapShot = await getDocs(cartCollRef);
      const batch = writeBatch(db);
      cartQuerySnapShot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      return [];
    } catch (error) {
      return thunkAPI.rejectWithValue({ error });
    }
  }
);

// Reducer to fetch user order history
export const getUserOrderHistory = createAsyncThunk(
  "product/getUserOrderHistory",
  async (payload, thunkAPI) => {
    const { currentUser } = payload;
    try {
      const orderCollRef = collection(
        db,
        `userOrders/${currentUser.uid}/orders`
      );
      // Sort by orderDate in descending order
      const q = query(orderCollRef, orderBy("orderDate", "desc"));
      return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(
          q,
          (querySnapShot) => {
            const newOrderHistory = [];
            querySnapShot.forEach((doc) => {
              newOrderHistory.push({ id: doc.id, ...doc.data() });
            });
            resolve(newOrderHistory);
            // Unsubscribe from the snapshot listener
            unsubscribe();
          },
          (error) => {
            reject(error);
          }
        );
      });
    } catch (error) {
      // Reject the promise with the error
      return thunkAPI.rejectWithValue({ error });
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    cartTotal: (state, action) => {
      state.cartTotal = state.userCart.reduce(
        (total, product) => total + product.price + product.quantity,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToUserCart.fulfilled, (state, action) => {})
      .addCase(decCartItemQty.fulfilled, (state, action) => {})
      .addCase(removeFromUserCart.fulfilled, (state, action) => {
        // console.log(action.payload);
      })
      .addCase(getUserCartItems.fulfilled, (state, action) => {
        state.userCart = [...action.payload];
      })
      .addCase(placeOrder.fulfilled, (state, action) => {})
      .addCase(clearUserCart.fulfilled, (state, action) => {
        state.userCart = action.payload;
      })
      .addCase(getUserOrderHistory.fulfilled, (state, action) => {
        state.userOrder = [...action.payload];
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = [...action.payload];
        const prices = state.products.map((item) => item.price);
        state.minPrice = Math.min(...prices);
        state.maxPrice = Math.max(...prices);
      });
  },
});

export const productReducer = productSlice.reducer;
export const productActions = productSlice.actions;

export const productSelector = (state) => state.productReducer;
