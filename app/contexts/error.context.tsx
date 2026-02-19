import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

interface ErrorContextValue {
  showError: (message: string, title?: string) => void;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

interface ErrorProviderProps {
  readonly children: ReactNode;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [error, setError] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const showError = (message: string, title: string = "Error") => {
    setError({ title, message });
  };

  const handleClose = () => {
    setError(null);
  };

  const value = useMemo(() => ({ showError }), []);

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <AlertDialog open={!!error} onOpenChange={handleClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <i className="ri-error-warning-line text-red-500 text-xl" />
              {error?.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {error?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleClose}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
}
