
import './App.css'
import AppRoutes from './Routes/AppRouter.jsx'
import { checkAuth } from "./Store/authSlice";
import { loadCartFromFirebase } from "./Store/CartSlice";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

function App() {
 const dispatch = useDispatch();
 const userEmail = useSelector((state) => state.auth.email);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Load cart after authentication is checked
  useEffect(() => {
    if (userEmail) {
      dispatch(loadCartFromFirebase(userEmail));
    }
  }, [userEmail, dispatch]);


  return (
    <>
    <AppRoutes />
    </>
  )
}

export default App
