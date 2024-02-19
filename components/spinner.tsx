import { ReloadIcon } from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import clsx from "clsx";

export type SpinnerProps = IconProps;

export function Spinner(props: SpinnerProps) {
  const { className, ...rest } = props;

  return (
    <ReloadIcon 
      className={clsx("animate-spin", className)} 
      {...rest}
    />
  );
}