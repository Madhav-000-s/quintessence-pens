import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pen Configurator | Quintessence Pens",
  description: "Design your perfect luxury fountain pen with our interactive 3D configurator",
};

export default function ConfiguratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
