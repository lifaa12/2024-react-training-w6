import { NavLink, Outlet } from "react-router";

const FrontLayout = () => {
  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <ul className="navbar-nav flex-row gap-4 fs-5">
            <li className="nav-item">
              <NavLink className="nav-link" to="">首頁</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">產品列表</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/cart">購物車</NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default FrontLayout;