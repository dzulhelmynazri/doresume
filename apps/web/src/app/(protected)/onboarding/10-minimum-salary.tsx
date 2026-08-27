"use client";

import {
  clampSalaryAmount,
  convertSalaryAmount,
  formatSalaryAmount,
  formatSalaryCurrencyLabel,
  getSalaryRange,
  minimumSalarySchema,
  parseSalaryInput,
  SALARY_BAR_COUNT,
  SALARY_CURRENCIES,
  SALARY_CURRENCY_OPTIONS,
  SALARY_DISTRIBUTION_BAR_HEIGHTS,
  SALARY_PERIOD_OPTIONS,
  SALARY_PERIODS,
  salaryAmountToIndex,
  salaryIndexToAmount,
} from "@doresume/contracts";
import type {
  MinimumSalary,
  SalaryCurrency,
  SalaryPeriod,
} from "@doresume/contracts";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@doresume/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@doresume/ui/components/input-group";
import { QuestionnaireInput } from "@doresume/ui/components/questionnaire";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@doresume/ui/components/select";
import { Slider } from "@doresume/ui/components/slider";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@doresume/ui/components/toggle-group";
import { cn } from "@doresume/ui/lib/utils";
import { useForm } from "@tanstack/react-form";

const MINIMUM_SALARY_DEFAULTS: MinimumSalary = {
  amount: getSalaryRange("yearly").default,
  currency: "MYR",
  period: "yearly",
};

const isSalaryPeriod = (value: string): value is SalaryPeriod =>
  SALARY_PERIODS.some((period) => period === value);

const isSalaryCurrency = (value: string): value is SalaryCurrency =>
  SALARY_CURRENCIES.some((currency) => currency === value);

export const useMinimumSalaryForm = (
  onValidSubmit: (value: MinimumSalary) => void | Promise<void>
) =>
  useForm({
    defaultValues: MINIMUM_SALARY_DEFAULTS,
    onSubmit: async ({ value }) => {
      await onValidSubmit(minimumSalarySchema.parse(value));
    },
    validators: {
      onSubmit: minimumSalarySchema,
    },
  });

type MinimumSalaryFormApi = ReturnType<typeof useMinimumSalaryForm>;

const SalaryHistogram = ({
  amount,
  onAmountChange,
  period,
}: {
  amount: number;
  onAmountChange: (amount: number) => void;
  period: SalaryPeriod;
}) => {
  const selectedIndex = salaryAmountToIndex(amount, period);

  const setSelectedIndex = (index: number) => {
    onAmountChange(salaryIndexToAmount(index, period));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-40 items-end gap-0.5 px-0.5">
        {SALARY_DISTRIBUTION_BAR_HEIGHTS.map((barHeight, index) => {
          const isSelected = index >= selectedIndex;
          const barAmount = salaryIndexToAmount(index, period);

          return (
            <button
              aria-label={`Set minimum salary to ${formatSalaryAmount(barAmount)}`}
              aria-pressed={index === selectedIndex}
              className="flex h-full min-w-0 flex-1 cursor-pointer items-end border-0 bg-transparent p-0 hover:opacity-80"
              key={index}
              onClick={() => {
                setSelectedIndex(index);
              }}
              type="button"
            >
              <span
                aria-hidden
                className={cn(
                  "block w-full rounded-t-full transition-colors",
                  isSelected ? "bg-primary/30" : "bg-muted"
                )}
                style={{ height: barHeight }}
              />
            </button>
          );
        })}
      </div>
      <Slider
        aria-label="Minimum salary"
        className="[&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-thumb]]:bg-background py-2 [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:rounded-full [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-track]]:h-1"
        max={SALARY_BAR_COUNT - 1}
        min={0}
        onValueChange={(value) => {
          const nextValue = Array.isArray(value) ? value[0] : value;

          if (typeof nextValue === "number") {
            setSelectedIndex(nextValue);
          }
        }}
        step={1}
        value={[selectedIndex]}
      />
    </div>
  );
};

const MinimumSalaryFields = ({ form }: { form: MinimumSalaryFormApi }) => (
  <FieldGroup>
    <form.Subscribe selector={(state) => state.values}>
      {(values) => (
        <div className="sr-only">
          <QuestionnaireInput
            key={JSON.stringify(values)}
            aria-label="Minimum salary"
            defaultValue={JSON.stringify(values)}
            readOnly
          />
        </div>
      )}
    </form.Subscribe>
    <form.Field name="period">
      {(periodField) => (
        <ToggleGroup
          aria-label="Salary period"
          className="bg-muted w-full rounded-lg p-1"
          onValueChange={([selected]) => {
            if (!selected || !isSalaryPeriod(selected)) {
              return;
            }

            const nextPeriod = selected;
            const convertedAmount = convertSalaryAmount(
              periodField.form.getFieldValue("amount"),
              periodField.state.value,
              nextPeriod
            );

            periodField.handleChange(nextPeriod);
            periodField.form.setFieldValue(
              "amount",
              clampSalaryAmount(convertedAmount, nextPeriod)
            );
          }}
          spacing={0}
          value={[periodField.state.value]}
        >
          {SALARY_PERIOD_OPTIONS.map((option) => (
            <ToggleGroupItem
              className="text-muted-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:hover:bg-background flex-1 rounded-md border-transparent bg-transparent hover:bg-transparent aria-pressed:shadow-sm"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
    </form.Field>
    <form.Subscribe
      selector={(state) => ({
        amount: state.values.amount,
        period: state.values.period,
      })}
    >
      {({ amount, period }) => (
        <SalaryHistogram
          amount={amount}
          onAmountChange={(nextAmount) => {
            form.setFieldValue("amount", nextAmount);
          }}
          period={period}
        />
      )}
    </form.Subscribe>
    <form.Field name="amount">
      {(amountField) => (
        <form.Subscribe selector={(state) => state.values.period}>
          {(period) => {
            const isInvalid =
              amountField.state.meta.isTouched &&
              !amountField.state.meta.isValid;
            const displayValue = formatSalaryAmount(amountField.state.value);

            return (
              <FieldSet data-invalid={isInvalid}>
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="minimum-salary">
                    Minimum salary
                  </FieldLabel>
                  <InputGroup className="h-10">
                    <InputGroupInput
                      aria-invalid={isInvalid}
                      id="minimum-salary"
                      inputMode="numeric"
                      onBlur={() => {
                        amountField.handleBlur();
                        amountField.handleChange(
                          clampSalaryAmount(amountField.state.value, period)
                        );
                      }}
                      onChange={(event) => {
                        const parsed = parseSalaryInput(event.target.value);

                        if (parsed !== null) {
                          amountField.handleChange(parsed);
                        }
                      }}
                      value={displayValue}
                    />
                    <InputGroupAddon align="inline-end">
                      <form.Field name="currency">
                        {(currencyField) => (
                          <Select
                            items={SALARY_CURRENCY_OPTIONS.map((option) => ({
                              label: formatSalaryCurrencyLabel(
                                option.value,
                                period
                              ),
                              value: option.value,
                            }))}
                            onValueChange={(next) => {
                              if (next && isSalaryCurrency(next)) {
                                currencyField.handleChange(next);
                              }
                            }}
                            value={currencyField.state.value}
                          >
                            <SelectTrigger
                              aria-label="Salary currency"
                              className="h-8 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent
                              align="end"
                              alignItemWithTrigger={false}
                            >
                              <SelectGroup>
                                {SALARY_CURRENCY_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {formatSalaryCurrencyLabel(
                                      option.value,
                                      period
                                    )}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      </form.Field>
                    </InputGroupAddon>
                  </InputGroup>
                  {isInvalid ? (
                    <FieldError errors={amountField.state.meta.errors} />
                  ) : null}
                </Field>
              </FieldSet>
            );
          }}
        </form.Subscribe>
      )}
    </form.Field>
  </FieldGroup>
);

export { MINIMUM_SALARY_DEFAULTS, MinimumSalaryFields };
