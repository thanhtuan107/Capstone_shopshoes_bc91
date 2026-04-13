// src/routes/index.jsx
import { Route } from "react-router-dom";   // ← Quan trọng: Phải import Route

import HomeTemplate from "../pages/HomeTemplate";
import ProductListPage from "../pages/HomeTemplate/ListShoesPage";
import DetailProductPage from "../pages/HomeTemplate/DetailShoes";
import SignIn from "../pages/HomeTemplate/SignIn";
import Register from "../pages/HomeTemplate/Register";
import Profile from "../pages/HomeTemplate/Profile";
import PageNotFound from "../pages/PageNotFound";

import Cart from "../pages/HomeTemplate/Cart";

const routes = [
  {
    path: "",
    element: HomeTemplate,
    children: [
      { path: "", element: ProductListPage },
      { path: "products", element: ProductListPage },
      { path: "detail/:id", element: DetailProductPage },
      { path: "cart", element: Cart },
    ],
  },
  { path: "signin", element: SignIn },
  { path: "register", element: Register },
  { path: "profile", element: Profile },
  { path: "*", element: PageNotFound },
];

export const renderRoutes = () => {
  return routes.map((route) => {
    if (route.children) {
      return (
        <Route 
          key={route.path} 
          path={route.path} 
          element={<route.element />} 
        >
          {route.children.map((child) => (
            <Route
              key={child.path}
              path={child.path}
              element={<child.element />}
            />
          ))}
        </Route>
      );
    }
    return (
      <Route 
        key={route.path} 
        path={route.path} 
        element={<route.element />} 
      />
    );
  });
};