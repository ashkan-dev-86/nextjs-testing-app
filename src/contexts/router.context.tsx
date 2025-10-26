"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  PropsWithChildren,
  FC,
} from "react";
import { useRouter } from "next/navigation";
import { AppError } from "@/app/enums/app-errors.enum";

interface NavigationOptions {
  skipLocationChange?: boolean;
}

interface InternalRouterContextType {
  currentPath: string;
  navigate: (path: string, options?: NavigationOptions) => void;
}

const InternalRouterContext = createContext<InternalRouterContextType | null>(
  null
);

export function InternalRouterProvider({
  children,
  initialPath = "/",
}: PropsWithChildren<{ initialPath?: string }>) {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const router = useRouter();

  const navigate = useCallback(
    (path: string, options?: NavigationOptions) => {
      options = {
        ...options,
        skipLocationChange: options?.skipLocationChange ?? true,
      };

      if (options.skipLocationChange) {
        setCurrentPath(path);

        return;
      }

      router.push(path);
    },
    [router]
  );

  return (
    <InternalRouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </InternalRouterContext.Provider>
  );
}

export function useSkipLocationRouter() {
  const context = useContext(InternalRouterContext);
  if (!context) {
    throw new Error(AppError.NAVIGATION_SKIP_ERROR);
  }

  return context.navigate;
}

export interface RouteConfig {
  path: string;
  component: FC;
}

export function InternalSwitch({ routes }: { routes: RouteConfig[] }) {
  const { currentPath } = useContext(InternalRouterContext)!;
  const MatchedComponent = routes.find(
    (route) => route.path === currentPath
  )?.component;

  return MatchedComponent ? <MatchedComponent /> : <div></div>;
}
