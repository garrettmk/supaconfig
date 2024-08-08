import { GearIcon } from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import clsx from "clsx";

export type LoadingProps = IconProps;

export function Loading(props: LoadingProps) {
  const { className, ...iconProps } = props;

  return (
    <div className="grow shrink flex flex-col gap-3 justify-center items-center">
      <GearIcon
        className={clsx("w-12 h-12 animate-[spin_2s_linear_infinite]", className)}
        {...iconProps}
      />
      <span className="text-muted-foreground animate-pulse">Loading...</span>
    </div>
  );
}