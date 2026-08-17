import type { Metadata } from "next";
import AuthShell from "../components/AuthShell";

export const metadata: Metadata = {
  title: "Sign up — NAATI Excellence Academy",
  description: "Create your free NAATI Excellence Academy account and start learning today.",
};

export default function SignupPage() {
  return <AuthShell mode="signup" />;
}
