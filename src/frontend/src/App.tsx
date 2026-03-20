import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import FishingGamePage from "./pages/FishingGamePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import OwnerDashboardPage from "./pages/OwnerDashboardPage";
import PierGearPage from "./pages/PierGearPage";
import ProfilePage from "./pages/ProfilePage";
import UploadVideoPage from "./pages/UploadVideoPage";
import VideoFeedPage from "./pages/VideoFeedPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: VideoFeedPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upload",
  component: UploadVideoPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: OwnerDashboardPage,
});

const videoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/video/$id",
  component: VideoPlayerPage,
});

const fishingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fishing",
  component: FishingGamePage,
});

const pierGearRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pier-gear",
  component: PierGearPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileRoute,
  uploadRoute,
  dashboardRoute,
  videoRoute,
  fishingRoute,
  pierGearRoute,
  leaderboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
