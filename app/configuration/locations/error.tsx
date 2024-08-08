'use client';

import { Button } from "@/app/(components)/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-4">Error</h1>
        <p className="text-lg text-foreground/60 mb-4">
          {error.message}
        </p>
        <Button onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}