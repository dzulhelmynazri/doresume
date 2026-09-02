"use client";

import type { ApplicationSettings } from "@doresume/contracts";
import type { UserOnboardingState } from "@doresume/db/user-onboarding";
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
import {
  ApplicationPasswordFields,
  useApplicationPasswordForm,
} from "./11-application-password";
import {
  ApplicationSettingsFields,
  useApplicationSettingsForm,
} from "./12-application-settings";
import { InboxFields } from "./13-inbox";
import { ChecklistFields, useChecklistForm } from "./14-checklist";

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
  { name: "password", required: true },
  { name: "settings", required: true },
  { name: "inbox", required: false },
  { name: "checklist", required: true },
] as const;
const ONBOARDING_STEPS = ONBOARDING_ITEMS.map((item) => item.name);

type OnboardingStep = (typeof ONBOARDING_ITEMS)[number]["name"];

const ONBOARDING_STEP_NAMES = new Set<string>(ONBOARDING_STEPS);

const onboardingStepParser = parseAsStringLiteral(ONBOARDING_STEPS)
  .withDefault("resume")
  .withOptions({ history: "push" });

const isOnboardingStep = (value: string): value is OnboardingStep =>
  ONBOARDING_STEP_NAMES.has(value);

const Onboarding = ({
  initialOnboarding,
  initialResume,
}: {
  initialOnboarding: UserOnboardingState;
  initialResume: UploadedResume | null;
}) => {
  const router = useRouter();
  const [step, setStep] = useQueryState("step", onboardingStepParser);
  const files = useFiles({ endpoint: "/api/files" });
  const [uploaded, setUploaded] = useState<UploadedResume | null>(
    initialResume
  );
  const [isParsing, setIsParsing] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const locationForm = useLocationForm(async (value) => {
    await client.saveLocation(value);
  }, initialOnboarding.location);
  const contactForm = useContactForm(
    async (value) => {
      await client.saveContact(value);
    },
    {
      linkedin: initialOnboarding.linkedin ?? "",
      phone: initialOnboarding.phone ?? "",
    }
  );
  const eligibilityForm = useWorkEligibilityForm(async (value) => {
    await client.saveWorkEligibility(value);
  }, initialOnboarding.workEligibility);
  const checklistForm = useChecklistForm(async (value) => {
    await client.saveChecklist(value);
  }, initialOnboarding.checklist ?? undefined);
  const industriesForm = useIndustriesForm(async (value) => {
    await client.saveIndustries(value);
  }, initialOnboarding.industries ?? undefined);
  const experienceLevelForm = useExperienceLevelForm(
    async (value) => {
      await client.saveExperienceLevel(value);
    },
    { experienceLevel: initialOnboarding.experienceLevel ?? undefined }
  );
  const workTypeForm = useWorkTypeForm(
    async (value) => {
      await client.saveWorkType(value);
    },
    { workType: initialOnboarding.workType ?? undefined }
  );
  const educationLevelForm = useEducationLevelForm(
    async (value) => {
      await client.saveEducationLevel(value);
    },
    { educationLevel: initialOnboarding.educationLevel ?? undefined }
  );
  const workArrangementForm = useWorkArrangementForm(
    async (value) => {
      await client.saveWorkArrangement(value);
    },
    { workArrangement: initialOnboarding.workArrangement ?? undefined }
  );
  const minimumSalaryForm = useMinimumSalaryForm(async (value) => {
    await client.saveMinimumSalary(value);
  }, initialOnboarding.minimumSalary ?? undefined);
  const passwordForm = useApplicationPasswordForm(
    async (value) => {
      await client.saveApplicationPassword(value);
    },
    { password: initialOnboarding.applicationPassword ?? "" }
  );
  const finishOnboarding = async (applicationSettings: ApplicationSettings) => {
    setIsFinishing(true);

    try {
      const steps: {
        form: {
          handleSubmit: () => Promise<void>;
          state: { isValid: boolean };
        };
        message: string;
        step: OnboardingStep;
      }[] = [
        {
          form: locationForm,
          message: "Enter your location to continue.",
          step: "location",
        },
        {
          form: contactForm,
          message: "Check your contact details.",
          step: "contact",
        },
        {
          form: eligibilityForm,
          message: "Add where you can work.",
          step: "eligibility",
        },
        {
          form: industriesForm,
          message: "Choose the industries you want to work in.",
          step: "industries",
        },
        {
          form: experienceLevelForm,
          message: "Choose the experience level that fits you best.",
          step: "experience",
        },
        {
          form: workTypeForm,
          message: "Choose what type of work you're open to.",
          step: "workType",
        },
        {
          form: educationLevelForm,
          message: "Choose your highest education level.",
          step: "education",
        },
        {
          form: workArrangementForm,
          message: "Choose how you'd like to work.",
          step: "workArrangement",
        },
        {
          form: minimumSalaryForm,
          message: "Enter your desired minimum salary.",
          step: "minimumSalary",
        },
        {
          form: passwordForm,
          message: "Set a password for application sites.",
          step: "password",
        },
        {
          form: checklistForm,
          message: "Finish the checklist to continue.",
          step: "checklist",
        },
      ];

      // Each handleSubmit validates its own form and only saves when valid,
      // so every step can validate and save concurrently instead of paying a
      // full request round trip per step. Walking the steps in order after
      // keeps the "jump to the first step that failed" behavior.
      const results = await Promise.allSettled(
        steps.map(({ form }) => form.handleSubmit())
      );

      let firstFailure: { message: string; step: OnboardingStep } | null = null;
      let isSaveFailure = false;

      for (const [index, stepEntry] of steps.entries()) {
        if (results[index]?.status === "rejected") {
          firstFailure = { message: stepEntry.message, step: stepEntry.step };
          isSaveFailure = true;
          break;
        }

        if (!stepEntry.form.state.isValid) {
          firstFailure = { message: stepEntry.message, step: stepEntry.step };
          break;
        }
      }

      if (firstFailure) {
        toast.error(
          isSaveFailure ? "Could not save your details." : firstFailure.message
        );

        if (!isSaveFailure) {
          void setStep(firstFailure.step);
        }

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
  const settingsForm = useApplicationSettingsForm(
    finishOnboarding,
    initialOnboarding.applicationSettings ?? undefined
  );

  const { isUploading } = files;
  const canContinueResume = uploaded !== null && !isUploading && !isParsing;

  const handleResumeUploaded = async (resume: UploadedResume) => {
    setUploaded(resume);
    setIsParsing(true);

    try {
      await client.parseResume({ key: resume.key });
    } catch {
      toast.error(
        "We saved your resume but could not parse it. You can edit it in Documents."
      );
    }

    setIsParsing(false);
  };

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
          isParsing={isParsing}
          uploaded={uploaded}
          onClear={() => {
            setUploaded(null);
          }}
          onUploaded={(resume) => {
            void handleResumeUploaded(resume);
          }}
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
        <WorkEligibilityFields form={eligibilityForm} syncQuestionnaire />
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
        <MinimumSalaryFields form={minimumSalaryForm} syncQuestionnaire />
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
      <QuestionnaireItem name="inbox">
        <QuestionnaireTitle>Connect your inbox</QuestionnaireTitle>
        <QuestionnaireDescription>
          Some job sites send a verification code before an application can be
          submitted. Connect your inbox so our agent can read those codes and
          finish the application for you. You can also connect later from
          settings.
        </QuestionnaireDescription>
        <InboxFields />
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
      <QuestionnaireItem name="checklist" required>
        <QuestionnaireTitle>Quick checklist</QuestionnaireTitle>
        <QuestionnaireDescription>
          A few last questions. Tap through. Defaults work for most people. Only
          change what applies.
        </QuestionnaireDescription>
        <ChecklistFields form={checklistForm} syncQuestionnaire />
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
