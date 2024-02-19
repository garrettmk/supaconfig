import { Suspense } from "react";
import { UrlPaginatorComponentProps, UrlPaginatorComponent } from "./url-paginator-component";
import { UrlPaginatorFallback } from "./url-paginator-fallback";

export type UrlPaginatorProps = UrlPaginatorComponentProps;

export function UrlPaginator(props: UrlPaginatorProps) {
  return (
    <Suspense fallback={<UrlPaginatorFallback {...props}/>}>
      <UrlPaginatorComponent {...props}/>
    </Suspense>
  );
}
