import { useEffect, useState } from "react";

const getLocationState = () => {
  if (typeof window === "undefined") {
    return {
      pathname: "",
      searchParams: new URLSearchParams(),
    };
  }

  return {
    pathname: window.location.pathname,
    searchParams: new URLSearchParams(window.location.search),
  };
};

function useLocationState() {
  const [locationState, setLocationState] = useState(getLocationState);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleChange = () => {
      setLocationState(getLocationState());
    };

    window.addEventListener("popstate", handleChange);
    window.addEventListener("hashchange", handleChange);

    return () => {
      window.removeEventListener("popstate", handleChange);
      window.removeEventListener("hashchange", handleChange);
    };
  }, []);

  return locationState;
}

export function usePathname() {
  return useLocationState().pathname;
}

export function useRouter() {
  return {
    push: (href: string) => {
      window.location.assign(href);
    },
    replace: (href: string) => {
      window.location.replace(href);
    },
    refresh: () => {
      window.location.reload();
    },
  };
}

export function useSearchParams() {
  return useLocationState().searchParams;
}
