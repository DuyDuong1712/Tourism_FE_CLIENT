import { useState } from "react";
import { useRoutes } from "react-router-dom";
import "./App.css";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Tour from "./pages/tours";
import LayoutHeader from "./layouts/main-layout";
import User from "./pages/user";
import TourDetails from "./pages/tourDetails";
import ChangePassword from "./pages/user/change-password";
import DeleteUser from "./pages/user/delete-user";
import Order from "./pages/order";
import PaymentCallback from "./pages/paymentCallback";
import OrderSuccess from "./pages/order/orderSuccess";
import UserOrder from "./pages/user/user-order";

function App() {
  const routes = useRoutes([
    {
      path: "",
      element: <LayoutHeader />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/tours/:slug",
          element: <Tour />,
        },
        {
          path: "/user",
          element: <User />,
        },
        {
          path: "/user/user-order",
          element: <UserOrder />,
        },
        {
          path: "/user/change-password",
          element: <ChangePassword />,
        },
        {
          path: "/user/delete-user",
          element: <DeleteUser />,
        },
        {
          path: "/tour-details/:id/:title",
          element: <TourDetails />,
        },
        {
          path: "/order",
          element: <Order />,
        },
        {
          path: "/order-success/:bookingId",
          element: <OrderSuccess />,
        },

        {
          path: "/payments/payment-callback",
          element: <PaymentCallback />,
        },
      ],
    },
  ]);
  return routes;
}

export default App;
