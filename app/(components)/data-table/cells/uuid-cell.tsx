import React from "react";
import clsx from "clsx";
import { truncate } from "@/app/(lib)/utils/utils";
import { CopyToClipboardButton } from "../../copy-button";

export type UUIDCellProps = React.ComponentProps<'pre'> & {
  value?: string;
};

export function UUIDCell(props: UUIDCellProps) {
  const { value, className, ...preProps } = props;

  return (
    <pre className={clsx("group", className)} {...preProps}>
      {value ? (
        <>
          {truncate(value, 8)}
          <CopyToClipboardButton 
            className="ml-2 w-8 h-8 opacity-0 group-hover:opacity-100"
            valueToCopy={value}
          />
        </>
      ) : (
        'N/A'
      )}
    </pre>
  );
}