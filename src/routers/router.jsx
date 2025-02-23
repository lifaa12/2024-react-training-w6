import FrontLayout from "../layouts/frontLayout";
import Cart from "../views/cart";
import Home from "../views/Home";
import ProductDetail from "../views/ProductDetail";
import Products from "../views/Products";


const routes = [
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: '/products',
        element: <Products />
      },
      {
        path: '/product/:id',
        element: <ProductDetail />
      },
      {
        path: '/cart',
        element: <Cart />
      }
    ]
  }
]

export default routes;