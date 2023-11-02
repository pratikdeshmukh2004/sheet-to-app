import Lottie from "react-lottie";
import animationData from "../animations/loading_dot.json";

const Loader = () => (
  <div className="flex backdrop-blur-[1px] cursor-wait justify-center items-center w-full h-full absolute">
    <Lottie
      style={{ width: "400px", height: "400px", cursor: "wait" }}
      options={{
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      }}
    />
  </div>
);
export default Loader;
