
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { useEffect } from "react";


export const MainLayout =  () => {
  const location = useLocation();
  
  useEffect(() => {
  }, [location.pathname]);
  
  return (
    <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 bg-white overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>
            <Outlet key={location.pathname} />
        </main>
    </div>
  )
}
