"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Layers, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login realizado",
        description: "Bem-vindo de volta!",
        variant: "success",
      });

      // Demo only: a real app sets an httpOnly cookie server-side (e.g. from
      // an API route or Server Action) instead of writing it from the
      // client. `src/proxy.ts` just checks that this cookie exists.
      document.cookie = "auth-token=demo-session; path=/; max-age=86400";

      const redirectTo = searchParams.get("from") ?? "/dashboard";
      router.push(redirectTo);
    }, 1200);
  }

  return (
    <Card className="w-full max-w-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Layers className="size-5" />
        </span>
        <h1 className="text-xl font-semibold">Entrar na sua conta</h1>
        <p className="text-sm text-muted-foreground">
          Use suas credenciais para acessar o painel.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            required
            leftIcon={<Mail />}
            placeholder="voce@email.com"
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Senha
          </label>
          <PasswordInput
            id="password"
            required
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between">
          <Checkbox id="remember" label="Lembrar-me" defaultChecked />
          <a href="#" className="text-sm font-medium text-primary hover:underline">
            Esqueceu a senha?
          </a>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full">
          Entrar
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Voltar para o{" "}
        <Link href="/" className="font-medium text-primary hover:underline">
          showcase
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
