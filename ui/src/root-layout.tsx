import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionsProvider } from "./contexts/sessions-context";
import { queryClient } from "./lib/query-client";
import { SessionContainer } from "./containers/session-container";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";

// YG3 fork: hide Steel Browser's nav/header chrome when ?embed=true
// (used by linkedin-engine onboarding popups). Default behavior is unchanged.
function isEmbed(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("embed") === "true" || params.get("embed") === "1";
}

export default function RootLayout() {
  const embed = isEmbed();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionsProvider>
        <ThemeProvider defaultTheme="dark" storageKey="steel-ui-theme">
          <div className="flex flex-col h-screen overflow-hidden max-h-screen items-center justify-center flex-1 bg-secondary text-primary-foreground">
            {!embed && <Header />}
            <div className="flex flex-col overflow-hidden flex-1 w-full">
              <SessionContainer />
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </SessionsProvider>
    </QueryClientProvider>
  );
}
