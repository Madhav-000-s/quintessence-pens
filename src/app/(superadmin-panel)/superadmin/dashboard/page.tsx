import { redirect } from "next/navigation";

export default function DashboardRoot() {
  redirect("/superadmin/dashboard/overview");
}
