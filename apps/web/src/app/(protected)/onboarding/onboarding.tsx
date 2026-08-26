"use client";

import type { WorkEligibility } from "@doresume/contracts";
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

const ONBOARDING_STEPS = [
  "resume",
  "location",
  "contact",
  "eligibility",
] as const;
const ONBOARDING_ITEMS = [
  { name: "resume", required: true },
  { name: "location", required: true },
  { name: "contact", required: false },
  { name: "eligibility", required: true },
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
  const finishOnboarding = async (eligibility: WorkEligibility) => {
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

      await client.saveWorkEligibility(eligibility);
      router.push("/dashboard");
    } catch {
      toast.error("Could not save your details.");
      setIsFinishing(false);
    }
  };
  const eligibilityForm = useWorkEligibilityForm(finishOnboarding);

  const { isUploading } = files;
  const canContinueResume = uploaded !== null && !isUploading;

  return (
    <Questionnaire
      className="w-full max-w-lg"
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

        void eligibilityForm.handleSubmit();
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
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext disabled={!canContinueResume}>
          Continue
        </QuestionnaireNext>
        <eligibilityForm.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => {
            const isBusy = isFinishing || isSubmitting;

            return (
              <QuestionnaireSubmit disabled={isBusy}>
                {isBusy ? <Spinner data-icon="inline-start" /> : null}
                Continue
              </QuestionnaireSubmit>
            );
          }}
        </eligibilityForm.Subscribe>
      </QuestionnaireActions>
    </Questionnaire>
  );
};

export default Onboarding;
