import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { ToastProvider } from './components/ToastProvider';
import { Sidebar } from './components/Sidebar';
import { WorkflowTracker } from './components/WorkflowTracker';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { SimulationPage } from './pages/SimulationPage';
import { BrochurePage } from './pages/BrochurePage';
import { ReportPage } from './pages/ReportPage';
import { LinkedInPage } from './pages/LinkedInPage';
import { AutoPostPage } from './pages/AutoPostPage';
import { MetricsPage } from './pages/MetricsPage';

// ─── Layout ───────────────────────────────────────────────────────────────────

function AppLayout() {
  return (
    <div className="flex h-screen bg-[#06060f] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Workflow tracker bar */}
        <div className="shrink-0 px-6 py-3 border-b border-white/[0.06] bg-[#08080f]/60 backdrop-blur-xl">
          <WorkflowTracker />
        </div>
        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app-layout',
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/dashboard',
  component: Dashboard,
});

const simulationRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/simulation',
  component: SimulationPage,
});

const brochureRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/brochure',
  component: BrochurePage,
});

const reportRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/report',
  component: ReportPage,
});

const linkedinRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/linkedin',
  component: LinkedInPage,
});

const autopostRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/autopost',
  component: AutoPostPage,
});

const metricsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/metrics',
  component: MetricsPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    simulationRoute,
    brochureRoute,
    reportRoute,
    linkedinRoute,
    autopostRoute,
    metricsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
