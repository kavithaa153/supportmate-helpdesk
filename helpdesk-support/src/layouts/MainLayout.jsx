import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
 
import "./MainLayout.css";
import Header from "../components/header";

function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />

      <div className="main-content-area">
        <Header />

        <main className="main-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;