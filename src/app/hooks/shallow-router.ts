'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

type NavigationOptions = {
  scroll?: boolean;
};

type ShallowRouter = {
  push: (path: string, options?: NavigationOptions) => void;
  replace: (path: string, options?: NavigationOptions) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  prefetch: (path: string) => void;
  pathname: string;
  searchParams: URLSearchParams;
};

export function useShallowRouter(): ShallowRouter {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const push = useCallback((path: string, options: NavigationOptions = {}): void => {
    startTransition(() => {
      router.push(path, options);
    });
  }, [router]);

  const replace = useCallback((path: string, options: NavigationOptions = {}): void => {
    startTransition(() => {
      router.replace(path, options);
    });
  }, [router]);

  const prefetch = useCallback((path: string): void => {
    router.prefetch(path);
  }, [router]);

  return {
    push,
    replace,
    back: router.back,
    forward: router.forward,
    refresh: router.refresh,
    prefetch,
    pathname,
    searchParams,
  };
}