export interface ChaiReferenceGroup {
  title: string;
  blurb: string;
  utilities: string[];
}

export interface ChaiTheme {
  colors: Record<string, string>;
  fontSizes: Record<string, string>;
  fontWeights: Record<string, string>;
  lineHeights: Record<string, string>;
  letterSpacings: Record<string, string>;
  radii: Record<string, string>;
  shadows: Record<string, string>;
  maxWidths: Record<string, string>;
}

export interface ChaiRuntime {
  refresh(root?: Document | Element): number;
  theme: ChaiTheme;
  referenceGroups: ChaiReferenceGroup[];
  getCssText(): string;
}

declare const ChaiCSS: ChaiRuntime;

declare const refresh: ChaiRuntime["refresh"];
declare const theme: ChaiRuntime["theme"];
declare const referenceGroups: ChaiRuntime["referenceGroups"];
declare const getCssText: ChaiRuntime["getCssText"];

export { ChaiCSS, refresh, theme, referenceGroups, getCssText };
export default ChaiCSS;
