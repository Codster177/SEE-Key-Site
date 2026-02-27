import { redirect } from "next/navigation";
import { getAdminFromCookie } from "@/app/lib/auth";
import AdminDashboard from "./AdminDashboard";

export default async function DashboardPage() {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin");
  return <AdminDashboard />;
}
