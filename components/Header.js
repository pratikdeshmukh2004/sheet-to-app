import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("user");
    router.replace("/auth/login");
  };

  return (
    <div className="flex py-5 lg:relative absolute top-[0px] right-[20px] justify-between">
      <div className="flex">
        <img src="/logo.webp" className="w-6 hidden lg:block h-6 mr-2" />
        <h2 className="text-lg hidden lg:block text-white font-bold font">
          PGHH Streetlights Pithampur Cluster
        </h2>
      </div>
      <button onClick={logout}>
        <FontAwesomeIcon className="text-white" icon={faSignOut} />
      </button>
    </div>
  );
};

export default Header;
