"use client";

import type {
  Checklist,
  MinimumSalary,
  WorkEligibility,
} from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@doresume/ui/components/card";
import { FieldSeparator } from "@doresume/ui/components/field";
import { Spinner } from "@doresume/ui/components/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";

import {
  ELIGIBILITY_DEFAULTS,
  useWorkEligibilityForm,
  WorkEligibilityFields,
} from "@/app/(protected)/onboarding/4-eligibility";
import {
  MINIMUM_SALARY_DEFAULTS,
  MinimumSalaryFields,
  useMinimumSalaryForm,
} from "@/app/(protected)/onboarding/10-minimum-salary";
import {
  CHECKLIST_DEFAULTS,
  ChecklistFields,
  useChecklistForm,
} from "@/app/(protected)/onboarding/11-checklist";
import { client, orpc } from "@/utils/orpc";

const AtsForm = ({
  checklist,
  eligibility,
  minimumSalary,
}: {
  checklist: Checklist | null;
  eligibility: WorkEligibility | null;
  minimumSalary: MinimumSalary | null;
}) => {
  const queryClient = useQueryClient();
  const hasSavedData =
    eligibility !== null || minimumSalary !== null || checklist !== null;
  const [isSaving, setIsSaving] = useState(false);
  const savedSections = useRef({
    checklist: false,
    eligibility: false,
    salary: false,
  });

  const eligibilityForm = useWorkEligibilityForm(async (value) => {
    await client.saveWorkEligibility(value);
    savedSections.current.eligibility = true;
  }, eligibility ?? ELIGIBILITY_DEFAULTS);

  const salaryForm = useMinimumSalaryForm(async (value) => {
    await client.saveMinimumSalary(value);
    savedSections.current.salary = true;
  }, minimumSalary ?? MINIMUM_SALARY_DEFAULTS);

  const checklistForm = useChecklistForm(async (value) => {
    await client.saveChecklist(value);
    savedSections.current.checklist = true;
  }, checklist ?? CHECKLIST_DEFAULTS);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    savedSections.current = {
      checklist: false,
      eligibility: false,
      salary: false,
    };

    try {
      await Promise.all([
        eligibilityForm.handleSubmit(),
        salaryForm.handleSubmit(),
        checklistForm.handleSubmit(),
      ]);

      const {
        eligibility: savedEligibility,
        salary,
        checklist: savedChecklist,
      } = savedSections.current;

      if (savedEligibility && salary && savedChecklist) {
        await queryClient.invalidateQueries({
          queryKey: orpc.getAtsFormData.key(),
        });
        toast.success("ATS form saved.");
        return;
      }

      toast.error("Fix the highlighted fields before saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="py-4" onSubmit={handleSave}>
      <div className="flex max-w-2xl flex-col gap-6 py-2">
        <CardHeader className="px-0">
          <CardTitle>ATS form</CardTitle>
          <CardDescription>
            {hasSavedData
              ? "We reuse these when filling job applications."
              : "Tell us how to answer common application questions."}
          </CardDescription>
        </CardHeader>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-base font-medium">Work authorization</h2>
            <p className="text-muted-foreground text-sm">
              Citizenship and work eligibility by country.
            </p>
          </div>
          <CardContent className="px-0">
            <WorkEligibilityFields form={eligibilityForm} />
          </CardContent>
        </section>

        <FieldSeparator />

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-base font-medium">Work preferences</h2>
            <p className="text-muted-foreground text-sm">
              Expected salary and hourly rate — switch period to set annual or
              hourly expectations.
            </p>
          </div>
          <CardContent className="px-0">
            <MinimumSalaryFields form={salaryForm} />
          </CardContent>
        </section>

        <FieldSeparator />

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-base font-medium">Application answers</h2>
            <p className="text-muted-foreground text-sm">
              Preferences, background, diversity questions, and extra notes for
              applications.
            </p>
          </div>
          <CardContent className="px-0">
            <ChecklistFields form={checklistForm} />
          </CardContent>
        </section>

        <CardFooter className="px-0">
          <Button disabled={isSaving} type="submit">
            {isSaving ? <Spinner data-icon="inline-start" /> : null}
            {hasSavedData ? "Update ATS form" : "Save ATS form"}
          </Button>
        </CardFooter>
      </div>
    </form>
  );
};

export { AtsForm };
