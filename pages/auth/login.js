import React from "react";
import GoogleLoginButton from "./GoogleLoginButton"; // Import the GoogleLoginButton
import { GoogleOAuthProvider } from "@react-oauth/google";

const LoginForm = () => {

  
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-gray-600 space-y-5">
        <div className="text-center pb-8">
          <img src="/logo.webp" width={120} className="mx-auto" />
          <div className="mt-5">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-orange-600 shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label className="font-medium">Password</label>
            <input
              type="password"
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-orange-600 shadow-sm rounded-lg"
            />
          </div>
          <button className="w-full mb-3 px-4 py-2 text-white font-medium bg-orange-600 hover:bg-orange-500 active:bg-orange-600 rounded-lg duration-150">
            Sign in
          </button>
        </form>

        {/* Google Login Button */}
        <GoogleOAuthProvider clientId="70658986281-8p73mimd3ofglgu85dqgaa3eo0u05bk1.apps.googleusercontent.com">
          <GoogleLoginButton />
        </GoogleOAuthProvider>

      </div>
    </main>
  );
};

export default LoginForm;
