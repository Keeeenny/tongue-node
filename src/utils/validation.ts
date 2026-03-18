export const parseId = (id: string | undefined): number | null => {
  if (!id) return null;

  const parsed = parseInt(id, 10);

  if (isNaN(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

export const isValidNumber = (value: unknown): value is number => {
  return typeof value === "number" && !isNaN(value) && Number.isFinite(value);
};
