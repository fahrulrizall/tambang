import { Route, Routes } from "react-router-dom";
import MainLayout from "../Pages/MainLayout";
import { TugBoat, Barging, Transhipment } from "../Pages";

export default function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <>
          <Route path="tugboat" element={<TugBoat />} />
          <Route path="barging" element={<Barging />} />
          <Route path="transhipment" element={<Transhipment />} />
        </>
      </Route>
    </Routes>
  );
}
