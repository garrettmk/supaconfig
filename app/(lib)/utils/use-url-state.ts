import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { makeUrl } from "./url";
import { type NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";


export function useUrlState(key: string) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const value = searchParams.get(key);
  const setValue = (newValue: string | null, options?: NavigateOptions) => router.push(
    makeUrl({
      baseUrl: pathname,
      searchParams,
      set: newValue ? { [key]: newValue } : {},
      delete: newValue ? [] : [key]
    }),
    options
  );

  return [value, setValue] as const;
}