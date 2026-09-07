"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, User } from "lucide-react";
import { Input, PasswordInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const userFormSchema = z.object({
  name: z.string().min(2, "Informe pelo menos 2 caracteres."),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
  role: z.string().min(1, "Informe um cargo."),
  acceptTerms: z.boolean().refine((value) => value, {
    message: "Você precisa aceitar os termos para continuar.",
  }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export interface UserFormProps {
  onSuccess?: (values: UserFormValues) => void;
}

/**
 * Example CRUD form wiring `react-hook-form` to our base `Input`s via
 * `register()` — they already `forwardRef`, so no adapter is needed.
 * Validation rules live in `userFormSchema` above; add/relax fields there.
 */
export function UserForm({ onSuccess }: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: "", email: "", password: "", role: "", acceptTerms: false },
  });

  async function onSubmit(values: UserFormValues) {
    // Demo only: simulates a network request. Swap for
    // `api.post("/users", values)` (see `src/lib/api.ts`) against a real backend.
    await new Promise((resolve) => setTimeout(resolve, 700));
    toast({
      title: "Registro salvo com sucesso!",
      description: `${values.name} foi adicionado à equipe.`,
      variant: "success",
    });
    onSuccess?.(values);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-form-name" className="text-sm font-medium">
            Nome completo
          </label>
          <Input
            id="user-form-name"
            leftIcon={<User />}
            placeholder="Ana Souza"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-form-email" className="text-sm font-medium">
            E-mail
          </label>
          <Input
            id="user-form-email"
            type="email"
            leftIcon={<Mail />}
            placeholder="voce@empresa.com"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-form-password" className="text-sm font-medium">
            Senha
          </label>
          <PasswordInput
            id="user-form-password"
            placeholder="Mínimo 8 caracteres"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-form-role" className="text-sm font-medium">
            Cargo
          </label>
          <Input
            id="user-form-role"
            placeholder="Engenheira Frontend"
            error={errors.role?.message}
            {...register("role")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Checkbox
          id="user-form-terms"
          label="Aceito os termos de uso"
          {...register("acceptTerms")}
        />
        {errors.acceptTerms && (
          <p className="text-xs text-danger">{errors.acceptTerms.message}</p>
        )}
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-fit">
        Criar usuário
      </Button>
    </form>
  );
}
