import React, { createContext, useContext, useEffect, useState } from "react";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    signInWithPopup,
    sendPasswordResetEmail,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firebaseAuth, googleProvider } from "../config/firebaseInit";

// Create an authentication context
const authContext = createContext();


// Authentication context provider
const AuthContext = ({ children }) => {
    // State for the current user
    const [currentUser, setCurrentUser] = useState(null);
    // State to track if the user is an admin
    const [isAdmin, setIsAdmin] = useState(false);
    // State for loading state during authentication
    const [loading, setLoading] = useState(false);

    // Firebase authentication instance
    const auth = getAuth();

    // Register a new user with Firebase authentication
    const signUp = async (email, password) => {
        try {
            return await createUserWithEmailAndPassword(firebaseAuth, email, password);
        } catch (error) {
            console.error("Error during sign-up:", error);
        }
    };

    // Log the user in with Firebase authentication
    const signIn = async (email, password) => {
        try {
            return await signInWithEmailAndPassword(firebaseAuth, email, password);
        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    };

    // Log in with Google using Firebase authentication
    const signInWithGoogle = async () => {
        return signInWithPopup(firebaseAuth, googleProvider);
    };

    // Log out the current user from the session or account
    const logout = () => {
        return signOut(firebaseAuth);
    };

    // Reset the user's password and show a success toast
    const resetPassword = async (email) => {
        try {
            return await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error("Error sending password reset email:", error);
        }
    };

    // Set the current logged-in user and check if they are an admin
    useEffect(() => {
        setLoading(true);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            // Check if the user is an admin
            if (user && user.email === "vinayakt890@gmail.com") {
                setIsAdmin(true);
            }
            setLoading(false);
        });
        return unsubscribe;
    });

    // Provide the authentication context values to the components
    return (
        <authContext.Provider
            value={{
                signUp,
                signIn,
                logout,
                currentUser,
                resetPassword,
                signInWithGoogle,
                isAdmin,
                setLoading,
                loading
            }}
        >
            {/* Render children only when the loading state is false */}
            {!loading && children}
        </authContext.Provider>
    );
};

// Export a custom hook for using the authentication context
export const useAuthValue = () => useContext(authContext);

export default AuthContext;
