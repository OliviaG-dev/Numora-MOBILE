export type StructuredSectionLine = {
  key: string;
  label: string;
  value: string;
};

export type StructuredSection = {
  key: string;
  label: string;
  lines: StructuredSectionLine[];
};

export function isPlainObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function formatStructuredValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

export function formatStructuredLabel(raw: string): string {
  if (!raw) {
    return raw;
  }

  const normalized = raw
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function buildStructuredSections(value: unknown): StructuredSection[] {
  if (!isPlainObjectRecord(value)) {
    return [];
  }

  return Object.entries(value).map(([sectionKey, sectionValue]) => {
    if (!isPlainObjectRecord(sectionValue)) {
      return {
        key: sectionKey,
        label: formatStructuredLabel(sectionKey),
        lines: [
          {
            key: `${sectionKey}-value`,
            label: "Value",
            value: formatStructuredValue(sectionValue)
          }
        ]
      };
    }

    const lines = flattenRecord(sectionKey, sectionValue);
    return {
      key: sectionKey,
      label: formatStructuredLabel(sectionKey),
      lines
    };
  });
}

function flattenRecord(prefix: string, value: Record<string, unknown>): StructuredSectionLine[] {
  return Object.entries(value).flatMap(([key, item]) => {
    if (isPlainObjectRecord(item)) {
      return Object.entries(item).map(([childKey, childValue]) => ({
        key: `${prefix}-${key}-${childKey}`,
        label: `${formatStructuredLabel(key)} / ${formatStructuredLabel(childKey)}`,
        value: formatStructuredValue(childValue)
      }));
    }

    return [
      {
        key: `${prefix}-${key}`,
        label: formatStructuredLabel(key),
        value: formatStructuredValue(item)
      }
    ];
  });
}
