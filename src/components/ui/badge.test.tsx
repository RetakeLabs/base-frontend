import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>Ativo</Badge>);
    expect(screen.getByText("Ativo")).toBeInTheDocument();
  });

  it("applies the color variant's classes", () => {
    render(<Badge color="danger">Erro</Badge>);
    expect(screen.getByText("Erro")).toHaveClass("text-danger");
  });
});
