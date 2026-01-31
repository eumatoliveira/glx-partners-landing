import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import ThankYou from "./pages/ThankYou";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Plans from "./pages/Plans";
import AdminRoute from "./components/AdminRoute";
import ClientRoute from "./components/ClientRoute";
import {
  AdminDashboard,
  AdminFinanceiro,
  AdminUsuarios,
  AdminSistema,
  AdminErros,
  AdminFeatureFlags,
} from "./pages/admin";
import DataManagement from "./pages/admin/data-management/DataManagement";

// Client Dashboard Pages
import CEOScorecard from "./pages/client/CEOScorecard";
import OperationalWaste from "./pages/client/OperationalWaste";
import GrowthEngine from "./pages/client/GrowthEngine";
import Financials from "./pages/client/Financials";
import Operations from "./pages/client/Operations";
import Quality from "./pages/client/Quality";
import People from "./pages/client/People";
import DataGovernance from "./pages/client/DataGovernance";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/obrigado"} component={ThankYou} />
      <Route path={"/login"} component={Login} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/planos"} component={Plans} />
      
      {/* Admin Routes (Protected) - Centro de Comando */}
      <Route path={"/admin"}>
        <AdminRoute><AdminDashboard /></AdminRoute>
      </Route>
      <Route path={"/admin/financeiro"}>
        <AdminRoute><AdminFinanceiro /></AdminRoute>
      </Route>
      <Route path={"/admin/usuarios"}>
        <AdminRoute><AdminUsuarios /></AdminRoute>
      </Route>
      <Route path={"/admin/sistema"}>
        <AdminRoute><AdminSistema /></AdminRoute>
      </Route>
      <Route path={"/admin/erros"}>
        <AdminRoute><AdminErros /></AdminRoute>
      </Route>
      <Route path={"/admin/flags"}>
        <AdminRoute><AdminFeatureFlags /></AdminRoute>
      </Route>
      <Route path={"/admin/data-management"}>
        <AdminRoute><DataManagement /></AdminRoute>
      </Route>
      
      {/* Client Dashboard Routes (Protected) - GLX Performance */}
      <Route path={"/performance"}>
        <ClientRoute><CEOScorecard /></ClientRoute>
      </Route>
      <Route path={"/performance/financials"}>
        <ClientRoute><Financials /></ClientRoute>
      </Route>
      <Route path={"/performance/operations"}>
        <ClientRoute><Operations /></ClientRoute>
      </Route>
      <Route path={"/performance/waste"}>
        <ClientRoute><OperationalWaste /></ClientRoute>
      </Route>
      <Route path={"/performance/growth"}>
        <ClientRoute><GrowthEngine /></ClientRoute>
      </Route>
      <Route path={"/performance/quality"}>
        <ClientRoute><Quality /></ClientRoute>
      </Route>
      <Route path={"/performance/people"}>
        <ClientRoute><People /></ClientRoute>
      </Route>
      <Route path={"/performance/data"}>
        <ClientRoute><DataGovernance /></ClientRoute>
      </Route>
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
