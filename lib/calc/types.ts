export type Tone = "good" | "bad" | "neutral";

export interface InputSpec {
  key: string;
  label: string;
  group: string;
  default: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  help?: string;
}

export type Values = Record<string, number>;

export interface Kpi {
  label: string;
  value: string;
  tone?: Tone;
  hint?: string;
}

export interface Series {
  title: string;
  xPrefix: string;
  format: "currency" | "percent";
  lines: { name: string; color: string; points: { x: number; y: number }[] }[];
}

export interface Breakdown {
  title: string;
  total: number;
  items: { label: string; value: number; color: string }[];
}

export interface Table {
  title: string;
  columns: string[];
  rows: string[][];
}

export interface CalcResult {
  verdict: { text: string; tone: Tone };
  kpis: Kpi[];
  series?: Series;
  breakdown?: Breakdown;
  table?: Table;
}

export interface CalcDef {
  inputs: InputSpec[];
  compute: (v: Values) => CalcResult;
}
