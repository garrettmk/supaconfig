"use client";

import { copyToClipboard, truncate } from "@/app/(lib)/utils/utils";
import { Button, ButtonProps } from "./button";
import { CopyIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useToast } from "./use-toast";

export type CopyToClipboardButtonProps = Omit<ButtonProps, 'children'> & {
  valueToCopy?: string
}

export function CopyToClipboardButton(props: CopyToClipboardButtonProps) {
  const { valueToCopy, className, ...buttonProps } = props;
  const { toast } = useToast();

  const handleCopy = () => {
    if (valueToCopy) {
      copyToClipboard(valueToCopy);
      toast({
        title: 'Copied to Clipboard',
        description: truncate(valueToCopy, 50)
      })
    }
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className={clsx(className)}
      onClick={handleCopy}
      {...buttonProps}
    >
    <CopyIcon className="w-4 h-4" />
  </Button>
  );
}