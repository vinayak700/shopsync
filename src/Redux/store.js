import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./reducers/productReducer";
import { authReducer } from "./reducers/authReducer";

export const store = configureStore({
    reducer: {
        authReducer,
        productReducer,
    },
    middleware: (getdefaultMiddleware) => getdefaultMiddleware({ serializableCheck: false })
})