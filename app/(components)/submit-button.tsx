import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./button";
import { Spinner } from "./spinner";

export type SubmitButtonProps = Omit<ButtonProps, 'children'> & {
  submittingText?: string;
  defaultText?: string;
};

export function SubmitButton({
  submittingText = 'Submitting...',
  defaultText = 'Submit',
  ...props
}: SubmitButtonProps) {
  const status = useFormStatus();

  return (
    <Button
      type='submit'
      disabled={status.pending}
      {...props}
    >
      {status.pending ? <Spinner className="w-4 h-4 mr-2" /> : null}
      {status.pending ? submittingText : defaultText}
    </Button>
  );
}