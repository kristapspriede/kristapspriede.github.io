import { Outlet } from "react-router";
import { BuyMeACoffeeButton } from "../BuyMeACoffeeButton/BuyMeACoffeeButton";
import { Navbar } from "../Navbar/Navbar";

export function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <BuyMeACoffeeButton />
    </div>
  );
}
