import type { ReactNode } from "react";

import { SiteFooter } from "../_components/site-footer";
import { SiteChrome } from "../_components/site-header";

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <SiteChrome />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}
