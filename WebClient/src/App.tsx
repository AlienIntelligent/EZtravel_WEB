import React, { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useGetProfileQuery } from "./store/apis/authApi";
import { useAppDispatch } from "./store/hooks";
import { setCredentials, logout } from "./store/authSlice";
import { ToastProvider } from "./components/ui/toast";

function App() {
  if (window.location.search.includes("crash=true")) {
    throw new Error("Verification crash test for ErrorBoundary");
  }
  const token = localStorage.getItem("token");
  const { data: user, error, isLoading } = useGetProfileQuery(undefined, { skip: !token });
  const dispatch = useAppDispatch();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsHydrated(true);
      return;
    }

    if (user) {
      dispatch(setCredentials({ user, token }));
      setIsHydrated(true);
    } else if (error) {
      dispatch(logout());
      setIsHydrated(true);
    }
  }, [user, error, token, dispatch]);

  if (isLoading || !isHydrated) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
