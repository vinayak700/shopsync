import React, { useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Cart, ErrorPage, Home, Orders, SignIn, SignUp, ForgotPassword } from './Pages';
import { MyNavbar } from './Components';
// import { Provider } from 'react-redux';
// import { store } from './Redux/store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, authSelector, setUser } from './Redux/reducers/authReducer';


const App = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(authSelector);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(authActions.setUser({ user }));
      } else {
        // User is signed outj
        dispatch(authActions.setUser(null));
      }
    });

    return () => {
      // Unsubscribe from the observer when the component is unmounted
      unsubscribe();
    };
  }, [auth, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<MyNavbar />}
          errorElement={<ErrorPage />}
        >
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;


