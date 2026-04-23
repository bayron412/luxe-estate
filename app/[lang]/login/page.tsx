import React from "react";
import LoginForm from "./LoginForm";
import { getDictionary } from "../../../lib/dictionary";

interface LoginPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <LoginForm dict={dict.login} />;
}
