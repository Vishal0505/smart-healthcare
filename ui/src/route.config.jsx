import { redirect } from "react-router-dom";

export const routeConfig = [
  {
    path: "/",
    loader: async () => redirect("/dashboard"),
  },
  {
    path: "/dashboard",
    lazy: () => import("@/pages/dashboard/index"),
  },
  {
    path: "patients/:id",
    lazy: () => import("@/pages/dashboard/patients"),
  },
  {
    path: "doctor-notes",
    lazy: () => import("@/pages/dashboard/doctor-notes"),
  },
  // {
  //   path: "*",
  //   lazy: () => import("@/pages/not-found"), // 404 page
  // },
];
