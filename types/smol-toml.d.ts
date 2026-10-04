declare module "smol-toml" {
  export type TomlPrimitive = string | number | boolean | Date;
  export type TomlValue = TomlPrimitive | TomlValue[] | { [key: string]: TomlValue };
  export function parse(toml: string): Record<string, TomlValue>;
  export function stringify(value: Record<string, TomlValue>): string;
}