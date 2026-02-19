import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

const routes: RouteConfig = [
  layout("components/layouts/app-layout.tsx", [
    index("routes/home.tsx"),
    route(
      "/connectivity/devices",
      "routes/connectivity/connectivity-device.tsx",
    ),
    route(
      "/connectivity/tag-manager",
      "routes/connectivity/connectivity-tag.tsx",
    ),
    route(
      "/data-engine/dynamic-tables",
      "routes/data-engine/dynamic-tables.tsx",
    ),
    route("/data-engine/storage-flows", "routes/data-engine/storage-flows.tsx"),
  ]),
  route("/login", "routes/auth/login.tsx"),
  route("/register", "routes/auth/register.tsx"),
  route("*", "routes/not-found.tsx"),
];

export default routes;
