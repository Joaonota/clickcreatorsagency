/* Números de impacto — PLACEHOLDERS.
   Substituir os valores "XX+" pelos números reais assim que forem fornecidos. */
export interface ImpactNumber {
  id: string;
  value: string;
  label: string;
  sublabel?: string;
}

export const impactNumbers: ImpactNumber[] = [
  { id: "imp-1", value: "01", label: "Creative", sublabel: "Agency" },
  { id: "imp-2", value: "04", label: "Core", sublabel: "Services" },
  { id: "imp-3", value: "XX+", label: "Creators", sublabel: "Na nossa rede" },
  { id: "imp-4", value: "XX+", label: "Projects", sublabel: "Entregues a marcas" },
];
