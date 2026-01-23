
import './App.css'
import AppRoutes from './Routes/AppRouter.jsx'
import { checkAuth } from "./Store/authSlice";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

function App() {
 const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);


  return (
    <>
    <AppRoutes />
    </>
  )
}

export default App
