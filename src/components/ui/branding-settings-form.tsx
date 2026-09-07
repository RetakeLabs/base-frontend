"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dropzone } from "@/components/ui/dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useObjectUrl } from "@/lib/use-object-url";

const brandingSchema = z.object({
  companyName: z.string().min(2, "Informe pelo menos 2 caracteres."),
  description: z.string().min(10, "Descreva o sistema em pelo menos 10 caracteres."),
  logo: z.array(z.custom<File>()).min(1, "Envie o logotipo da empresa."),
});

export type BrandingFormValues = z.infer<typeof brandingSchema>;

export interface BrandingSettingsFormProps {
  /** Called after a successful, validated submit — e.g. to update a real header elsewhere. */
  onSave?: (values: BrandingFormValues) => void;
}

/**
 * Example settings form: react-hook-form + zodResolver, same as `UserForm`.
 * The logo is a file (not a plain input value), so it's wired via
 * `Controller` instead of `register()`.
 */
export function BrandingSettingsForm({ onSave }: BrandingSettingsFormProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: { companyName: "", description: "", logo: [] },
  });

  const watchedName = useWatch({ control, name: "companyName" });
  const watchedLogo = useWatch({ control, name: "logo" });
  const logoFile = watchedLogo?.[0] ?? null;
  const logoPreviewUrl = useObjectUrl(logoFile);

  async function onSubmit(values: BrandingFormValues) {
    // Demo only: simulates a network request. Swap for
    // `api.post("/settings/branding", values)` (see `src/lib/api.ts`).
    await new Promise((resolve) => setTimeout(resolve, 700));
    toast({
      title: "Configurações salvas com sucesso!",
      description: "A identidade do painel foi atualizada.",
      variant: "success",
    });
    onSave?.(values);
    reset(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6 lg:w-2/3">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Logotipo</label>
        <Controller
          control={control}
          name="logo"
          render={({ field }) => (
            <Dropzone
              accept="image/*"
              multiple={false}
              onFilesSelected={(files) => field.onChange(files)}
            />
          )}
        />
        {errors.logo && <p className="text-xs text-danger">{errors.logo.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="branding-company-name" className="text-sm font-medium">
            Nome da empresa
          </label>
          <Input
            id="branding-company-name"
            leftIcon={<Building2 />}
            placeholder="ZeroLag"
            error={errors.companyName?.message}
            {...register("companyName")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="branding-description" className="text-sm font-medium">
            Descrição do sistema
          </label>
          <Textarea
            id="branding-description"
            placeholder="ZeroLag"
            error={errors.description?.message}
            {...register("description")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Preview do header
        </span>
        <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
          {logoPreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- preview of a user-selected local file (object URL)
            <img
              src={logoPreviewUrl}
              alt="Logotipo"
              className="size-7 max-w-full shrink-0 rounded object-contain"
            />
          ) : (
            <span className="flex size-7 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
              <Layers className="size-4" />
            </span>
          )}
          <span className="truncate font-semibold text-foreground">
            {watchedName || "Nome da empresa"}
          </span>
        </div>
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-fit">
        Salvar configurações
      </Button>
    </form>
  );
}
