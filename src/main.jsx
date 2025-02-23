import { createRoot } from 'react-dom/client'
import './assets/all.scss'
import { createHashRouter, RouterProvider } from 'react-router'
import routes from './routers/router'

const router = createHashRouter(routes);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
