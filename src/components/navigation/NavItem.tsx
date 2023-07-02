import Link, { LinkProps } from 'next/link';
import { PropsWithChildren } from 'react';

export function NavItem(props: PropsWithChildren<LinkProps>) {
  return <Link {...props} />;
}
