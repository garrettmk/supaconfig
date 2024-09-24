import clsx from "clsx";

export type TableControlLabelProps = React.ComponentProps<'div'>;

export function TableControlLabel(props: TableControlLabelProps) {
  const { className, children, ...rest } = props;

  return (
    <div 
      className={clsx('text-xs font-semibold text-muted-foreground whitespace-nowrap', className)} 
      {...rest}
    >
      {children}
    </div>
  );
}