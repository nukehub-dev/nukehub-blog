/**
 * Citation formatting for post references.
 *
 * The `references` frontmatter schema (see src/content.config.ts) carries
 * enough structure to generate plain-text citations, BibTeX entries, and RIS
 * records. `source` stays the human-readable display string; `authors`,
 * `type`, and `publisher` power the machine-readable formats.
 */

export type ReferenceType =
  "article" | "book" | "inproceedings" | "techreport" | "misc";

export interface Reference {
  id: string;
  title: string;
  url: string;
  source?: string;
  date?: string;
  authors?: string[];
  type?: ReferenceType;
  publisher?: string;
}

export interface CopyFormat {
  id: "text" | "bibtex" | "ris";
  label: string;
  text: string;
}

/** Human-readable one-line citation (the default copy format). */
export function formatCitationText(ref: Reference): string {
  const parts: string[] = [];
  if (ref.source) parts.push(ref.source);
  parts.push(`"${ref.title}"`);
  if (ref.date) parts.push(`(${ref.date})`);
  parts.push(ref.url);
  return parts.join(". ") + ".";
}

function extractYear(date: string | undefined): string | undefined {
  return date?.match(/\d{4}/)?.[0];
}

/** ISO YYYY-MM-DD if the date string carries one. */
function extractFullDate(date: string | undefined): string | undefined {
  return date?.match(/\d{4}-\d{2}-\d{2}/)?.[0];
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// BibTeX field values must not contain literal braces.
function bibtexValue(value: string): string {
  return value.replace(/[{}]/g, "");
}

export function formatBibTeX(ref: Reference, accessed?: string): string {
  const type = ref.type ?? "misc";
  const lines = [`@${type}{${ref.id},`];
  lines.push(`  title = {${bibtexValue(ref.title)}},`);
  if (ref.authors && ref.authors.length > 0) {
    lines.push(`  author = {${ref.authors.map(bibtexValue).join(" and ")}},`);
  }
  const year = extractYear(ref.date);
  if (year) lines.push(`  year = {${year}},`);
  const fullDate = extractFullDate(ref.date);
  if (fullDate) {
    lines.push(`  month = {${Number(fullDate.slice(5, 7))}},`);
  }
  const venue = ref.publisher ?? ref.source;
  if (venue) {
    const field =
      type === "article"
        ? "journal"
        : type === "misc"
          ? "howpublished"
          : "publisher";
    lines.push(`  ${field} = {${bibtexValue(venue)}},`);
  }
  if (accessed) lines.push(`  urldate = {${accessed}},`);
  lines.push(`  url = {${ref.url}}`, "}");
  return lines.join("\n");
}

const RIS_TYPES: Record<ReferenceType, string> = {
  article: "JOUR",
  book: "BOOK",
  inproceedings: "CONF",
  techreport: "RPRT",
  misc: "GEN",
};

export function formatRIS(ref: Reference, accessed?: string): string {
  const type = ref.type ?? "misc";
  const lines = [`TY  - ${RIS_TYPES[type]}`, `TI  - ${ref.title}`];
  for (const author of ref.authors ?? []) {
    lines.push(`AU  - ${author}`);
  }
  const year = extractYear(ref.date);
  if (year) lines.push(`PY  - ${year}`);
  const fullDate = extractFullDate(ref.date);
  if (fullDate) lines.push(`DA  - ${fullDate.replaceAll("-", "/")}`);
  const venue = ref.publisher ?? ref.source;
  if (venue) lines.push(`${type === "article" ? "JO" : "PB"}  - ${venue}`);
  lines.push(`UR  - ${ref.url}`);
  if (accessed) lines.push(`Y2  - ${accessed.replaceAll("-", "/")}`);
  lines.push("ER  -");
  return lines.join("\n");
}

/**
 * All formats offered by the copy menus, default first. `accessed` is the
 * retrieval date stamped into BibTeX (`urldate`) and RIS (`Y2`) since every
 * reference is a web source; defaults to today.
 */
export function buildCopyFormats(
  ref: Reference,
  accessed: string = todayISO(),
): CopyFormat[] {
  return [
    { id: "text", label: "Citation text", text: formatCitationText(ref) },
    { id: "bibtex", label: "BibTeX", text: formatBibTeX(ref, accessed) },
    { id: "ris", label: "RIS", text: formatRIS(ref, accessed) },
  ];
}
