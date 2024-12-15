import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
function Admindashboard() {
  return (
    <>
      <div className="flex">
        <SideNav />
        <div className="flex flex-1 flex-col">
          <header className="bg-purple-600 p-4 text-white">
            <h1 className="text-2xl">Admin Dashboard</h1>
          </header>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Admindashboard;
