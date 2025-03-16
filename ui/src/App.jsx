import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routeConfig } from "./route.config";
import { queryClient } from "./query";
import { QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter(routeConfig, {
  future: {
    v7_normalizeFormMethod: true,
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        fallbackElement={
          <div className="flex h-screen w-full items-center justify-center">
            <img src="/loading-spinner.gif" alt="Loading..." />
          </div>
        }
      />
    </QueryClientProvider>
  );
}
