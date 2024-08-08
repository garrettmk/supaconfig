import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./button";

export type CancelButtonProps = Omit<ButtonProps, 'children'> & {
  text?: string;
};

export function CancelButton({
  text = 'Cancel',
  ...props
}: CancelButtonProps) {
  const status = useFormStatus();

  return (
    <Button
      type='reset'
      disabled={status.pending}
      variant="outline"
      {...props}
    >
      {text}
    </Button>
  );
}