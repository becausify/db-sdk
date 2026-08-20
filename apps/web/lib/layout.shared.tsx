import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      url: "/",
    },
    searchToggle: {
      enabled: false,
    },
    themeSwitch: {
      enabled: false,
    },
  };
}
