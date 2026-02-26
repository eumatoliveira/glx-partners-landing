import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to external error tracking in production
    if (import.meta.env.PROD) {
      console.error("[ErrorBoundary]", error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;

      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-xl p-10">
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="absolute h-40 w-40 rounded-full bg-destructive/10 blur-[80px]"
            />

            <AlertTriangle
              size={52}
              className="text-destructive mb-8 flex-shrink-0"
              strokeWidth={1.5}
            />

            <h2 className="text-2xl font-bold mb-3 text-foreground text-center">
              Algo inesperado aconteceu
            </h2>
            <p className="text-muted-foreground text-center mb-6 text-sm">
              A página encontrou um erro. Tente recarregar ou voltar à página inicial.
            </p>

            {/* Show stack trace only in development — NEVER in production */}
            {isDev && this.state.error?.stack && (
              <div className="p-4 w-full rounded-lg bg-muted/50 border border-border overflow-auto mb-8 max-h-48">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words font-mono">
                  {this.state.error.stack}
                </pre>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold",
                  "bg-primary text-primary-foreground",
                  "hover:opacity-90 transition-opacity duration-200 cursor-pointer",
                  "shadow-[0_4px_14px_rgba(230,126,34,0.25)]"
                )}
              >
                <RotateCcw size={15} />
                Recarregar
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold",
                  "bg-muted text-foreground",
                  "hover:bg-muted/80 transition-colors duration-200 cursor-pointer",
                  "border border-border"
                )}
              >
                Página Inicial
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
