import type {
  FormFieldDefinition,
  FormFieldOption,
  FormFieldType,
} from "@doresume/ats-adapters";
import { Badge } from "@doresume/ui/components/badge";
import { Checkbox } from "@doresume/ui/components/checkbox";
import { Field, FieldTitle } from "@doresume/ui/components/field";

// ---------------------------------------------------------------------------
// Shared field props
// ---------------------------------------------------------------------------

interface ReadonlyFieldProps {
  field: FormFieldDefinition;
  value: unknown;
}

// ---------------------------------------------------------------------------
// Individual field components — read-only display of submitted values
// ---------------------------------------------------------------------------

const ReadonlyTextField = ({ field, value }: ReadonlyFieldProps) => (
  <Field>
    <FieldTitle>
      {field.label}
      {field.required ? (
        <span className="text-destructive ml-0.5">*</span>
      ) : null}
    </FieldTitle>
    <p className="text-sm font-medium">{String(value ?? "—")}</p>
  </Field>
);

const ReadonlyTextareaField = ({ field, value }: ReadonlyFieldProps) => (
  <Field>
    <FieldTitle>
      {field.label}
      {field.required ? (
        <span className="text-destructive ml-0.5">*</span>
      ) : null}
    </FieldTitle>
    <p className="text-sm font-medium whitespace-pre-wrap">
      {String(value ?? "—")}
    </p>
  </Field>
);

const ReadonlySelectField = ({ field, value }: ReadonlyFieldProps) => {
  const option = field.options?.find(
    (o: FormFieldOption) => o.value === String(value)
  );
  return (
    <Field>
      <FieldTitle>
        {field.label}
        {field.required ? (
          <span className="text-destructive ml-0.5">*</span>
        ) : null}
      </FieldTitle>
      <p className="text-sm font-medium">
        {option?.label ?? String(value ?? "—")}
      </p>
    </Field>
  );
};

const ReadonlyRadioField = ({ field, value }: ReadonlyFieldProps) => {
  const selected = field.options?.find(
    (o: FormFieldOption) => o.value === String(value)
  );
  return (
    <Field>
      <FieldTitle>
        {field.label}
        {field.required ? (
          <span className="text-destructive ml-0.5">*</span>
        ) : null}
      </FieldTitle>
      <div className="flex flex-wrap gap-1.5">
        {field.options?.map((option: FormFieldOption) => {
          const isSelected = option.value === String(value);
          return (
            <Badge
              key={option.value}
              variant={isSelected ? "default" : "outline"}
            >
              {option.label}
            </Badge>
          );
        }) ?? (
          <span className="text-sm font-medium">
            {selected?.label ?? String(value ?? "—")}
          </span>
        )}
      </div>
    </Field>
  );
};

const ReadonlyCheckboxField = ({ field, value }: ReadonlyFieldProps) => {
  const values = Array.isArray(value) ? value : [value];
  return (
    <Field>
      <FieldTitle>
        {field.label}
        {field.required ? (
          <span className="text-destructive ml-0.5">*</span>
        ) : null}
      </FieldTitle>
      <div className="flex flex-col gap-1.5">
        {field.options?.map((option: FormFieldOption) => (
          <div key={option.value} className="flex items-center gap-2">
            <Checkbox checked={values.includes(option.value)} disabled />
            <span className="text-sm">{option.label}</span>
          </div>
        )) ?? (
          <span className="text-sm font-medium">
            {values.join(", ") || "—"}
          </span>
        )}
      </div>
    </Field>
  );
};

const ReadonlyFileField = ({ field, value }: ReadonlyFieldProps) => (
  <Field>
    <FieldTitle>
      {field.label}
      {field.required ? (
        <span className="text-destructive ml-0.5">*</span>
      ) : null}
    </FieldTitle>
    <p className="text-muted-foreground text-sm italic">
      {value ? String(value) : "No file uploaded"}
    </p>
  </Field>
);

const ReadonlyDateField = ({ field, value }: ReadonlyFieldProps) => (
  <Field>
    <FieldTitle>
      {field.label}
      {field.required ? (
        <span className="text-destructive ml-0.5">*</span>
      ) : null}
    </FieldTitle>
    <p className="text-sm font-medium">{value ? String(value) : "—"}</p>
  </Field>
);

const ReadonlyPhoneField = ReadonlyTextField;
const ReadonlyNumberField = ReadonlyTextField;
const ReadonlyEeoField = ReadonlySelectField;

// ---------------------------------------------------------------------------
// Field registry — maps FormFieldType → component
// ---------------------------------------------------------------------------

export const FieldRegistry: Record<
  FormFieldType,
  React.FC<ReadonlyFieldProps>
> = {
  checkbox: ReadonlyCheckboxField,
  date: ReadonlyDateField,
  eeo: ReadonlyEeoField,
  file: ReadonlyFileField,
  number: ReadonlyNumberField,
  phone: ReadonlyPhoneField,
  radio: ReadonlyRadioField,
  select: ReadonlySelectField,
  text: ReadonlyTextField,
  textarea: ReadonlyTextareaField,
};
