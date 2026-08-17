import type { Metadata } from "next";
import AuthShell from "../components/AuthShell";

export const metadata: Metadata = {
  title: "Log in — NAATI Excellence Academy",
  description: "Log in to your NAATI Excellence Academy account to continue learning.",
};

export default function LoginPage() {
  return <AuthShell mode="login" />;
}
