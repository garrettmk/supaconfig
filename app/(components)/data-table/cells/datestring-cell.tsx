import React from "react";
import clsx from "clsx";


export type DateStringCellProps = React.ComponentProps<'span'> & {
  value?: string
};

export function DateStringCell(props: DateStringCellProps) {
  const { value, className, ...spanProps } = props;
  const date = new Date(value!);

  return (
    <span 
      className={clsx('inline-flex flex flex-col items-center justify-center', className)} 
      {...spanProps}
    >
      <span>{date.toLocaleDateString()}</span>
      <span className="text-xs">{date.toLocaleTimeString()}</span>
    </span>
  );
}