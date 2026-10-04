export type SizeRow = {
  size: string;
  bust: string;
  waist: string;
  hip: string;
  uk: string;
  us: string;
  eu: string;
};

export type SizeGroup = {
  id: string;
  label: string;
  description: string;
  rows: SizeRow[];
};

export const SIZE_GROUPS: SizeGroup[] = [
  {
    id: "ready-to-wear",
    label: "Ready-to-wear",
    description: "Body measurements in centimetres. If you sit between sizes, size up for a relaxed fit.",
    rows: [
      { size: "XS", bust: "80–84", waist: "62–66", hip: "88–92", uk: "6", us: "2", eu: "34" },
      { size: "S", bust: "84–88", waist: "66–70", hip: "92–96", uk: "8", us: "4", eu: "36" },
      { size: "M", bust: "88–94", waist: "70–76", hip: "96–102", uk: "10", us: "6", eu: "38" },
      { size: "L", bust: "94–100", waist: "76–82", hip: "102–108", uk: "12", us: "8", eu: "40" },
      { size: "XL", bust: "100–106", waist: "82–88", hip: "108–114", uk: "14", us: "10", eu: "42" },
      { size: "XXL", bust: "106–112", waist: "88–94", hip: "114–120", uk: "16", us: "12", eu: "44" }
    ]
  },
  {
    id: "footwear",
    label: "Footwear",
    description: "EU and UK sizing with the equivalent US conversion.",
    rows: [
      { size: "36", bust: "—", waist: "—", hip: "—", uk: "3", us: "5", eu: "36" },
      { size: "37", bust: "—", waist: "—", hip: "—", uk: "4", us: "6", eu: "37" },
      { size: "38", bust: "—", waist: "—", hip: "—", uk: "5", us: "7", eu: "38" },
      { size: "39", bust: "—", waist: "—", hip: "—", uk: "6", us: "8", eu: "39" },
      { size: "40", bust: "—", waist: "—", hip: "—", uk: "7", us: "9", eu: "40" },
      { size: "41", bust: "—", waist: "—", hip: "—", uk: "8", us: "10", eu: "41" },
      { size: "42", bust: "—", waist: "—", hip: "—", uk: "9", us: "11", eu: "42" }
    ]
  }
];

/** Order used to present size options; anything unknown is appended alphabetically. */
const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

export function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a);
    const bi = SIZE_ORDER.indexOf(b);

    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;

    const an = Number.parseInt(a, 10);
    const bn = Number.parseInt(b, 10);

    if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;

    return a.localeCompare(b);
  });
}

export function getSizeGroup(id: string): SizeGroup | undefined {
  return SIZE_GROUPS.find((group) => group.id === id);
}
