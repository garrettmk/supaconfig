import Link, { LinkProps } from "next/link";
import { split } from "../(lib)/utils/utils";
import { Button, ButtonProps } from "./button";

export type LinkButtonProps = ButtonProps & Partial<LinkProps>;

export function LinkButton(props: LinkButtonProps) {
  const [linkProps, buttonProps] = split(props, [
    'href',
    'as',
    'replace',
    'shallow',
    'scroll',
    'passHref',
    'prefetch',
    'locale',
    'legacyBehavior'
  ]);

  return linkProps.href ? (
    <Link {...linkProps} href={linkProps.href}>
      <Button {...buttonProps}/>
    </Link>
  ) : (
    <Button disabled {...buttonProps}/>
  );
}