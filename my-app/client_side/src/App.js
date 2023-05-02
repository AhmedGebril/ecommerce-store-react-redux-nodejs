import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import Layout from "./components/layout/Layout";
import Register from "./components/Register/Register";
import Signin from "./components/Signin/Signin";
import AddProducts from "./components/AddProducts/AddProducts";
import HomePage from "./components/Home/Home";
import Cart from "./components/Cart/Cart";
import Product from "./components/Product/Product";
import { Provider } from "react-redux";
import { store } from "./components/Store/rootReducer";
import Auth from "./components/RequireAuth/RequireAuth";

function App() {
  const Routing = createBrowserRouter([
    {path: '/',element: <Layout/>,children:[
      {index:true,element: <HomePage/>},
      {path: '/addProduct',element:<Auth><AddProducts/></Auth>},
      {path: '/Cart',element:<Cart/>},
      {path:'/Product/:id',element:<Product/>}
    ]},
    {path: 'Register',element: <Register/>},
    {path: 'Signin',element: <Signin/>},
])

  return (
    <Provider store={store}>
    <RouterProvider router={Routing}/>
    </Provider>
  );
}

export default App;
