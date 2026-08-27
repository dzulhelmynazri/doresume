"use client";

import type { ApplicationSettings } from "@doresume/contracts";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@doresume/ui/components/questionnaire";
import { Spinner } from "@doresume/ui/components/spinner";
import { useFiles } from "files-sdk/react";
import { useRouter } from "next/navigation";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";

import { client } from "@/utils/orpc";

import { ResumeDropzone } from "./1-resume";
import type { UploadedResume } from "./1-resume";
import { LocationFields, useLocationForm } from "./2-location";
import { ContactFields, useContactForm } from "./3-contact";
import { WorkEligibilityFields, useWorkEligibilityForm } from "./4-eligibility";
import { IndustryFields, useIndustriesForm } from "./5-industries";
import {
  ExperienceLevelFields,
  useExperienceLevelForm,
} from "./6-experience-level";
import { EducationLevelFields, useEducationLevelForm } from "./7-education";
import { WorkTypeFields, useWorkTypeForm } from "./8-work-type";
import {
  WorkArrangementFields,
  useWorkArrangementForm,
} from "./9-work-arrangement";
import { MinimumSalaryFields, useMinimumSalaryForm } from "./10-minimum-salary";
import { ChecklistFields, useChecklistForm } from "./11-checklist";
import {
  ApplicationPasswordFields,
  useApplicationPasswordForm,
} from "./12-application-password";
import {
  ApplicationSettingsFields,
  useApplicationSettingsForm,
} from "./13-application-settings";

const ONBOARDING_STEPS = [
  "resume",
  "location",
  "contact",
  "eligibility",
  "industries",
  "experience",
  "workType",
  "education",
  "workArrangement",
  "minimumSalary",
  "checklist",
  "password",
  "settings",
] as const;
const ONBOARDING_ITEMS = [
  { name: "resume", required: true },
  { name: "location", required: true },
  { name: "contact", required: false },
  { name: "eligibility", required: true },
  { name: "industries", required: true },
  { name: "experience", required: true },
  { name: "workType", required: true },
  { name: "education", required: true },
  { name: "workArrangement", required: true },
  { name: "minimumSalary", required: true },
  { name: "checklist", required: true },
  { name: "password", required: true },
  { name: "settings", required: true },
] as const;

const onboardingStepParser = parseAsStringLiteral(ONBOARDING_STEPS)
  .withDefault("resume")
  .withOptions({ history: "push" });

const isOnboardingStep = (
  value: string
): value is (typeof ONBOARDING_STEPS)[number] =>
  ONBOARDING_STEPS.some((step) => step === value);

const Onboarding = ({
  initialResume,
}: {
  initialResume: UploadedResume | null;
}) => {
  const router = useRouter();
  const [step, setStep] = useQueryState("step", onboardingStepParser);
  const files = useFiles({ endpoint: "/api/files" });
  const [uploaded, setUploaded] = useState<UploadedResume | null>(
    initialResume
  );
  const [isFinishing, setIsFinishing] = useState(false);
  const locationForm = useLocationForm(async (value) => {
    await client.saveLocation(value);
  });
  const contactForm = useContactForm(async (value) => {
    await client.saveContact(value);
  });
  const eligibilityForm = useWorkEligibilityForm(async (value) => {
    await client.saveWorkEligibility(value);
  });
  const checklistForm = useChecklistForm(async (value) => {
    await client.saveChecklist(value);
  });
  const industriesForm = useIndustriesForm(async (value) => {
    await client.saveIndustries(value);
  });
  const experienceLevelForm = useExperienceLevelForm(async (value) => {
    await client.saveExperienceLevel(value);
  });
  const workTypeForm = useWorkTypeForm(async (value) => {
    await client.saveWorkType(value);
  });
  const educationLevelForm = useEducationLevelForm(async (value) => {
    await client.saveEducationLevel(value);
  });
  const workArrangementForm = useWorkArrangementForm(async (value) => {
    await client.saveWorkArrangement(value);
  });
  const minimumSalaryForm = useMinimumSalaryForm(async (value) => {
    await client.saveMinimumSalary(value);
  });
  const passwordForm = useApplicationPasswordForm(async (value) => {
    await client.saveApplicationPassword(value);
  });
  const finishOnboarding = async (applicationSettings: ApplicationSettings) => {
    setIsFinishing(true);

    try {
      await locationForm.handleSubmit();

      if (!locationForm.state.isValid) {
        toast.error("Enter your location to continue.");
        void setStep("location");
        setIsFinishing(false);
        return;
      }

      await contactForm.handleSubmit();

      if (!contactForm.state.isValid) {
        toast.error("Check your contact details.");
        void setStep("contact");
        setIsFinishing(false);
        return;
      }

      await eligibilityForm.handleSubmit();

      if (!eligibilityForm.state.isValid) {
        toast.error("Add where you can work.");
        void setStep("eligibility");
        setIsFinishing(false);
        return;
      }

      await industriesForm.handleSubmit();

      if (!industriesForm.state.isValid) {
        toast.error("Choose the industries you want to work in.");
        void setStep("industries");
        setIsFinishing(false);
        return;
      }

      await experienceLevelForm.handleSubmit();

      if (!experienceLevelForm.state.isValid) {
        toast.error("Choose the experience level that fits you best.");
        void setStep("experience");
        setIsFinishing(false);
        return;
      }

      await workTypeForm.handleSubmit();

      if (!workTypeForm.state.isValid) {
        toast.error("Choose what type of work you're open to.");
        void setStep("workType");
        setIsFinishing(false);
        return;
      }

      await educationLevelForm.handleSubmit();

      if (!educationLevelForm.state.isValid) {
        toast.error("Choose your highest education level.");
        void setStep("education");
        setIsFinishing(false);
        return;
      }

      await workArrangementForm.handleSubmit();

      if (!workArrangementForm.state.isValid) {
        toast.error("Choose how you'd like to work.");
        void setStep("workArrangement");
        setIsFinishing(false);
        return;
      }

      await minimumSalaryForm.handleSubmit();

      if (!minimumSalaryForm.state.isValid) {
        toast.error("Enter your desired minimum salary.");
        void setStep("minimumSalary");
        setIsFinishing(false);
        return;
      }

      await checklistForm.handleSubmit();

      if (!checklistForm.state.isValid) {
        toast.error("Finish the checklist to continue.");
        void setStep("checklist");
        setIsFinishing(false);
        return;
      }

      await passwordForm.handleSubmit();

      if (!passwordForm.state.isValid) {
        toast.error("Set a password for application sites.");
        void setStep("password");
        setIsFinishing(false);
        return;
      }

      await client.saveApplicationSettings(applicationSettings);
      router.push("/dashboard");
    } catch {
      toast.error("Could not save your details.");
      setIsFinishing(false);
    }
  };
  const settingsForm = useApplicationSettingsForm(finishOnboarding);

  const { isUploading } = files;
  const canContinueResume = uploaded !== null && !isUploading;

  return (
    <Questionnaire
      className="w-full max-w-xl"
      item={step}
      items={ONBOARDING_ITEMS}
      onItemChange={(nextStep) => {
        if (isOnboardingStep(nextStep)) {
          void setStep(nextStep);
        }
      }}
      onSubmit={(event) => {
        event.preventDefault();

        if (!canContinueResume) {
          toast.error("Upload a resume to continue.");
          return;
        }

        void settingsForm.handleSubmit();
      }}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="resume" required>
        <QuestionnaireTitle>Upload your resume</QuestionnaireTitle>
        <QuestionnaireDescription>
          We will use this as the starting point for your applications.
        </QuestionnaireDescription>
        <div className="sr-only">
          <QuestionnaireInput
            key={uploaded?.key ?? "empty"}
            aria-label="Uploaded resume"
            defaultValue={uploaded?.key ?? ""}
            readOnly
          />
        </div>
        <ResumeDropzone
          files={files}
          uploaded={uploaded}
          onClear={() => {
            setUploaded(null);
          }}
          onUploaded={setUploaded}
        />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="location" required>
        <QuestionnaireTitle>Where do you live?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Most job sites need a full address. We&apos;ll fill it in
          automatically from here.
        </QuestionnaireDescription>
        <LocationFields form={locationForm} />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="contact">
        <QuestionnaireTitle>Contact</QuestionnaireTitle>
        <QuestionnaireDescription>
          Phone and LinkedIn show up on most applications. Leave these blank and
          we&apos;ll use whatever the resume parser finds.
        </QuestionnaireDescription>
        <ContactFields form={contactForm} />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="eligibility" required>
        <QuestionnaireTitle>Where can you work?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Add each country you&apos;d take a job in, then answer two quick
          questions for each. We use this to filter out jobs you can&apos;t
          apply to.
        </QuestionnaireDescription>
        <WorkEligibilityFields form={eligibilityForm} />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="industries" required>
        <QuestionnaireTitle>
          What industries are you interested in?
        </QuestionnaireTitle>
        <IndustryFields form={industriesForm} />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="experience" required>
        <QuestionnaireTitle>
          Which experience level fits you best?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          We&apos;ll use this to match you with roles at the right seniority.
        </QuestionnaireDescription>
        <ExperienceLevelFields form={experienceLevelForm} />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="workType" required>
        <QuestionnaireTitle>
          What type of work are you open to?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          We&apos;ll prioritize jobs that match your preferences.
        </QuestionnaireDescription>
        <WorkTypeFields form={workTypeForm} />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="education" required>
        <QuestionnaireTitle>
          What&apos;s your highest education level?
        </QuestionnaireTitle>
        <EducationLevelFields form={educationLevelForm} />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="workArrangement" required>
        <QuestionnaireTitle>How would you like to work?</QuestionnaireTitle>
        <WorkArrangementFields form={workArrangementForm} />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="minimumSalary" required>
        <QuestionnaireTitle>
          What&apos;s your desired minimum salary?
        </QuestionnaireTitle>
        <MinimumSalaryFields form={minimumSalaryForm} />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="checklist" required>
        <QuestionnaireTitle>Quick checklist</QuestionnaireTitle>
        <QuestionnaireDescription>
          A few last questions. Tap through. Defaults work for most people. Only
          change what applies.
        </QuestionnaireDescription>
        <ChecklistFields form={checklistForm} />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="password" required>
        <QuestionnaireTitle>Application password</QuestionnaireTitle>
        <QuestionnaireDescription>
          Set a password for sites that ask
        </QuestionnaireDescription>
        <passwordForm.Subscribe selector={(state) => state.values.password}>
          {(password) => (
            <div className="sr-only">
              <QuestionnaireInput
                key={password}
                aria-label="Application password"
                defaultValue={password}
                readOnly
                type="password"
              />
            </div>
          )}
        </passwordForm.Subscribe>
        <ApplicationPasswordFields form={passwordForm} />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="settings" required>
        <QuestionnaireTitle>How should we apply?</QuestionnaireTitle>
        <QuestionnaireDescription>
          You can change these anytime from settings.
        </QuestionnaireDescription>
        <settingsForm.Subscribe selector={(state) => state.values}>
          {(values) => (
            <div className="sr-only">
              <QuestionnaireInput
                key={JSON.stringify(values)}
                aria-label="Application settings"
                defaultValue={JSON.stringify(values)}
                readOnly
              />
            </div>
          )}
        </settingsForm.Subscribe>
        <ApplicationSettingsFields form={settingsForm} />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext disabled={!canContinueResume}>
          Continue
        </QuestionnaireNext>
        <settingsForm.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => {
            const isBusy = isFinishing || isSubmitting;

            return (
              <QuestionnaireSubmit disabled={isBusy}>
                {isBusy ? <Spinner data-icon="inline-start" /> : null}
                Continue
              </QuestionnaireSubmit>
            );
          }}
        </settingsForm.Subscribe>
      </QuestionnaireActions>
    </Questionnaire>
  );
};

export default Onboarding;
