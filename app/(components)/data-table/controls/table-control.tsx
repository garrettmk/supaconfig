import clsx from "clsx";

export type TableControlProps = React.ComponentProps<'div'> & {};

export function TableControl(props: TableControlProps) {
  const { className, ...rest } = props;

  return (
    <div
      className={clsx('space-y-1', className)}
      {...rest}
    />
  );
}