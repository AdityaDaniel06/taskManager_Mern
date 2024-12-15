import { Outlet } from "react-router-dom";
// import SideNav from "./SideNav";

function Layout() {
  return (
    <div className="flex h-screen">
      {/* <SideNav /> */}
      <div className="flex-1 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
