import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { makeUrl } from "./url";


export function useUrlState(key: string) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const value = searchParams.get(key);
  const setValue = (newValue: string | null) => router.push(makeUrl({
    baseUrl: pathname,
    searchParams,
    set: newValue ? { [key]: newValue } : {},
    delete: newValue ? [] : [key]
  }));

  return [value, setValue] as const;
}