import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

const routes: RouteConfig = [
  layout("components/layouts/app-layout.tsx", [
    index("routes/home.tsx"),
    route("/connectivity/devices", "routes/connectivity-device.tsx"),
    route("/connectivity/tag-manager", "routes/connectivity-tag.tsx"),
    route("/connectivity/opc-ua-server", "routes/connectivity-opcua.tsx"),
  ]),
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("*", "routes/not-found.tsx"),
];

export default routes;
