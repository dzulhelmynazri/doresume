"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ResumeDocument, ResumeSectionId } from "@doresume/contracts";
import {
  getCustomSection,
  getSectionTitle,
  isBuiltInSectionId,
  isSectionVisible,
} from "@doresume/contracts";

import {
  clearSection,
  reorderSections,
  toggleSectionVisibility,
} from "./lib/resume-actions";
import { ResumeEditorSection } from "./resume-editor-section";
import { CertificationsSection } from "./resume-sections/certifications-section";
import { CustomSectionEditor } from "./resume-sections/custom-section";
import { EducationSection } from "./resume-sections/education-section";
import { HeaderSection } from "./resume-sections/header-section";
import { ProjectsSection } from "./resume-sections/projects-section";
import { SkillsSection } from "./resume-sections/skills-section";
import { SummarySection } from "./resume-sections/summary-section";
import { WorkExperienceSection } from "./resume-sections/work-experience-section";

interface ResumeEditorPanelProps {
  document: ResumeDocument;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  resetKey: number;
}

const SECTION_DESCRIPTIONS: Partial<Record<ResumeSectionId, string>> = {
  certifications: "Licenses and certifications you've earned.",
  education: "Schools, degrees, and academic achievements.",
  projects: "Personal or professional projects worth highlighting.",
  skills: "Tools, languages, and technologies you know.",
  summary: "A short intro that sells your experience.",
  workExperience: "Roles, companies, and impact you've delivered.",
};

const renderBuiltInSection = (
  sectionId: ResumeSectionId,
  document: ResumeDocument,
  onChange: ResumeEditorPanelProps["onChange"],
  resetKey: number
) => {
  const common = { document, onChange, showHeading: false as const };

  switch (sectionId) {
    case "summary": {
      return <SummarySection {...common} />;
    }
    case "education": {
      return <EducationSection {...common} />;
    }
    case "skills": {
      return <SkillsSection key={resetKey} {...common} />;
    }
    case "workExperience": {
      return <WorkExperienceSection {...common} />;
    }
    case "projects": {
      return <ProjectsSection {...common} />;
    }
    case "certifications": {
      return <CertificationsSection {...common} />;
    }
    default: {
      return null;
    }
  }
};

const SortableEditorSection = ({
  document,
  onChange,
  resetKey,
  sectionId,
}: {
  document: ResumeDocument;
  onChange: ResumeEditorPanelProps["onChange"];
  resetKey: number;
  sectionId: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionId });
  const title = getSectionTitle(document, sectionId);
  const isVisible = isSectionVisible(document, sectionId);
  const customSection = getCustomSection(document, sectionId);
  const description = isBuiltInSectionId(sectionId)
    ? SECTION_DESCRIPTIONS[sectionId]
    : "Add your own section with bullet points.";

  const renderSectionContent = () => {
    if (isBuiltInSectionId(sectionId)) {
      return renderBuiltInSection(sectionId, document, onChange, resetKey);
    }

    if (customSection) {
      return (
        <CustomSectionEditor onChange={onChange} section={customSection} />
      );
    }

    return null;
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <ResumeEditorSection
        description={description}
        dragHandle={{ attributes, listeners }}
        isDragging={isDragging}
        isVisible={isVisible}
        onRemove={() => {
          onChange((current) => clearSection(current, sectionId));
        }}
        onToggleVisible={() => {
          onChange((current) => toggleSectionVisibility(current, sectionId));
        }}
        title={title}
      >
        {renderSectionContent()}
      </ResumeEditorSection>
    </div>
  );
};

export const ResumeEditorPanel = ({
  document,
  onChange,
  resetKey,
}: ResumeEditorPanelProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    onChange((current) =>
      reorderSections(current, String(active.id), String(over.id))
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <ResumeEditorSection
        description="Name, title, and contact information."
        title="Personal details"
      >
        <HeaderSection document={document} onChange={onChange} variant="form" />
      </ResumeEditorSection>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={document.sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-4">
            {document.sectionOrder.map((sectionId) => (
              <SortableEditorSection
                document={document}
                key={sectionId}
                onChange={onChange}
                resetKey={resetKey}
                sectionId={sectionId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
