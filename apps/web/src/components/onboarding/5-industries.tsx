"use client";

import { INDUSTRY_OPTIONS, industriesSchema } from "@doresume/contracts";
import type { Industries, Industry } from "@doresume/contracts";
import { Checkbox } from "@doresume/ui/components/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@doresume/ui/components/field";
import { QuestionnaireInput } from "@doresume/ui/components/questionnaire";
import {
  RadioGroup,
  RadioGroupItem,
} from "@doresume/ui/components/radio-group";
import { useForm } from "@tanstack/react-form";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenIcon,
  BriefcaseIcon,
  CheckIcon,
  ClapperboardIcon,
  CogIcon,
  CpuIcon,
  DumbbellIcon,
  FlaskConicalIcon,
  GlobeIcon,
  HardHatIcon,
  HeartIcon,
  HeartPulseIcon,
  HouseIcon,
  KeyRoundIcon,
  LandmarkIcon,
  LuggageIcon,
  MegaphoneIcon,
  PickaxeIcon,
  PiggyBankIcon,
  RocketIcon,
  ScaleIcon,
  ShieldIcon,
  SirenIcon,
  StoreIcon,
  TreeDeciduousIcon,
  TruckIcon,
  UsersIcon,
  WheatIcon,
  ZapIcon,
} from "lucide-react";

import { autosaveListener } from "./autosave";

const INDUSTRIES_DEFAULTS: Industries = {
  industries: [],
  openToAny: false,
};

const INDUSTRY_ICONS = {
  aerospace: RocketIcon,
  agriculture_fishing: WheatIcon,
  architecture_construction: HardHatIcon,
  defense_military: ShieldIcon,
  education: BookOpenIcon,
  energy_utilities: ZapIcon,
  entertainment_media: ClapperboardIcon,
  environmental: TreeDeciduousIcon,
  finance_insurance: PiggyBankIcon,
  government: LandmarkIcon,
  healthcare: HeartPulseIcon,
  home_services: HouseIcon,
  hospitality_tourism: LuggageIcon,
  hr_recruiting: UsersIcon,
  it_and_software: CpuIcon,
  logistics_transport: TruckIcon,
  manufacturing_trades: CogIcon,
  marketing_pr: MegaphoneIcon,
  mining: PickaxeIcon,
  nonprofit: HeartIcon,
  private_security: ScaleIcon,
  public_safety: SirenIcon,
  real_estate: KeyRoundIcon,
  retail_wholesale: StoreIcon,
  sales_bizdev: BriefcaseIcon,
  science_rd: FlaskConicalIcon,
  sports_athletics: DumbbellIcon,
} as const satisfies Record<Industry, LucideIcon>;

const toSavedIndustries = (value: Industries): Industries => {
  const parsed = industriesSchema.parse(value);

  return parsed.openToAny
    ? { industries: [], openToAny: true }
    : { industries: parsed.industries, openToAny: false };
};

export const useIndustriesForm = (
  onValidSubmit: (value: Industries) => void | Promise<void>,
  defaultValues: Industries = INDUSTRIES_DEFAULTS
) =>
  useForm({
    defaultValues,
    listeners: autosaveListener(industriesSchema, (value) =>
      onValidSubmit(toSavedIndustries(value))
    ),
    onSubmit: async ({ value }) => {
      await onValidSubmit(toSavedIndustries(value));
    },
    validators: {
      onSubmit: industriesSchema,
    },
  });

type IndustriesFormApi = ReturnType<typeof useIndustriesForm>;

const toggleIndustry = (
  industry: Industry,
  selected: Industry[]
): Industry[] => {
  if (selected.includes(industry)) {
    return selected.filter((item) => item !== industry);
  }

  return [...selected, industry];
};

const IndustryOptionCard = ({
  checked,
  icon: Icon,
  id,
  invalid,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  icon: LucideIcon;
  id: string;
  invalid: boolean;
  label: string;
  onCheckedChange: () => void;
}) => (
  <FieldLabel
    className="has-data-checked:border-primary [&>[data-slot=field]]:p-4"
    htmlFor={id}
  >
    <span className="sr-only">
      <Checkbox
        aria-invalid={invalid}
        checked={checked}
        id={id}
        onCheckedChange={onCheckedChange}
      />
    </span>
    <Field className="min-h-12 items-center" orientation="horizontal">
      <Icon className="text-muted-foreground group-has-data-checked/field-label:text-primary size-5 shrink-0" />
      <FieldContent>
        <FieldTitle className="group-has-data-checked/field-label:text-primary line-clamp-1 text-sm">
          {label}
        </FieldTitle>
      </FieldContent>
      {checked ? <CheckIcon className="text-primary size-4 shrink-0" /> : null}
    </Field>
  </FieldLabel>
);

const IndustryFields = ({ form }: { form: IndustriesFormApi }) => (
  <FieldGroup>
    <form.Subscribe selector={(state) => state.values}>
      {(values) => {
        const hasAnswer = values.openToAny || values.industries.length > 0;

        return (
          <div className="sr-only">
            <QuestionnaireInput
              key={JSON.stringify(values)}
              aria-label="Industries"
              defaultValue={hasAnswer ? JSON.stringify(values) : ""}
              readOnly
            />
          </div>
        );
      }}
    </form.Subscribe>
    <form.Field name="industries">
      {(industriesField) => (
        <form.Field name="openToAny">
          {(openToAnyField) => {
            const openToAny = openToAnyField.state.value;
            const selected = industriesField.state.value;
            const isInvalid =
              (industriesField.state.meta.isTouched ||
                openToAnyField.state.meta.isTouched) &&
              !industriesField.state.meta.isValid;

            return (
              <FieldSet data-invalid={isInvalid}>
                <FieldLegend className="sr-only">Industries</FieldLegend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {INDUSTRY_OPTIONS.map((option) => (
                    <IndustryOptionCard
                      checked={selected.includes(option.value)}
                      icon={INDUSTRY_ICONS[option.value]}
                      id={`industry-${option.value}`}
                      invalid={isInvalid}
                      key={option.value}
                      label={option.label}
                      onCheckedChange={() => {
                        industriesField.handleChange(
                          toggleIndustry(option.value, selected)
                        );
                        openToAnyField.handleChange(false);
                      }}
                    />
                  ))}
                </div>
                <RadioGroup
                  aria-invalid={isInvalid}
                  onValueChange={(value) => {
                    if (value !== "open_to_any") {
                      return;
                    }

                    openToAnyField.handleChange(true);
                    industriesField.handleChange([]);
                  }}
                  value={openToAny ? "open_to_any" : null}
                >
                  <FieldLabel
                    className="has-data-checked:border-primary [&>[data-slot=field]]:p-4"
                    htmlFor="open-to-any-industry"
                  >
                    <Field
                      className="min-h-12 items-center"
                      orientation="horizontal"
                    >
                      <RadioGroupItem
                        aria-invalid={isInvalid}
                        id="open-to-any-industry"
                        value="open_to_any"
                      />
                      <GlobeIcon className="text-muted-foreground group-has-data-checked/field-label:text-primary size-5 shrink-0" />
                      <FieldContent>
                        <FieldTitle className="group-has-data-checked/field-label:text-primary line-clamp-1 text-sm">
                          I&apos;m open to any industry
                        </FieldTitle>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                </RadioGroup>
                {isInvalid ? (
                  <FieldError errors={industriesField.state.meta.errors} />
                ) : null}
              </FieldSet>
            );
          }}
        </form.Field>
      )}
    </form.Field>
  </FieldGroup>
);

export { INDUSTRIES_DEFAULTS, IndustryFields };
