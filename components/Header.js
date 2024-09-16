import DataContext from "@/Context/dataContext";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useRouter } from "next/router";
import { useContext } from "react";

const Header = () => {
  const router = useRouter();
  const { user } = useContext(DataContext);

  const logout = () => {
    localStorage.removeItem("user");
    router.replace("/auth/login");
  };

  return (
    <div className="flex py-5 lg:relative absolute top-[10px] right-[20px] justify-between">
      <div className="flex">
        <img src="/logo.webp" className="w-6 hidden lg:block h-6 mr-2" />
        <h2 className="text-lg hidden lg:block text-white font-bold font">
          PGHH Streetlights Pithampur Cluster
        </h2>
      </div>
      <Menu>
        <MenuButton className="inline-flex items-center ">
          <img
            className="w-8 h-8 rounded-full border-2 border-orange-500"
            src={user?.picture}
          />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="mt-3 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <button
              onClick={logout}
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
            >
              Logout
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};

export default Header;
