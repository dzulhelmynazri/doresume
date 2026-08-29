import type { FormFieldType } from "../types";

export const COMMON_FIELD_TYPE_MAP: Record<string, FormFieldType> = {
  attachment: "file",
  checkbox: "checkbox",
  combobox: "select",
  date: "date",
  dropdown: "select",
  file: "file",
  long_text: "textarea",
  multi_select: "checkbox",
  number: "number",
  phone: "phone",
  radio: "radio",
  select: "select",
  "select-one": "select",
  single_select: "radio",
  tel: "phone",
  textarea: "textarea",
};

export const mapFieldType = (
  rawType?: string,
  customMap: Record<string, FormFieldType> = {}
): FormFieldType => {
  const normalized = rawType?.toLowerCase() ?? "";
  return customMap[normalized] ?? COMMON_FIELD_TYPE_MAP[normalized] ?? "text";
};
