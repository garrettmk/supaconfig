import { copyToClipboard } from "@/lib/utils";
import { Button, ButtonProps } from "./ui/button";
import { CopyIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

export type CopyToClipboardButtonProps = Omit<ButtonProps, 'children'> & {
  valueToCopy?: string
}

export function CopyToClipboardButton(props: CopyToClipboardButtonProps) {
  const { valueToCopy, className, ...buttonProps } = props;

  return (

    <Button
      variant="secondary"
      size="icon"
      className={clsx("opacity-0 group-hover:opacity-100 transition-opacity", className)}
      onClick={() => valueToCopy && copyToClipboard(valueToCopy)}
      {...buttonProps}
    >
    <CopyIcon className="w-4 h-4" />
  </Button>
  )
}