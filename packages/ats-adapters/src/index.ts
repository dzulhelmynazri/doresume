// Client
export { createApplyClient } from "./create-apply-client";
export type { ApplyClient, ApplyClientConfig } from "./create-apply-client";

// Adapters — import individually for tree-shaking:
// import { greenhouse } from "@doresume/ats-adapters/adapters/greenhouse"
// Or import all from the root:
export { greenhouse } from "./adapters/greenhouse";
export { lever } from "./adapters/lever";
export { workday } from "./adapters/workday";
export { ashby } from "./adapters/ashby";
export { generic } from "./adapters/generic";

// Types
export type {
  ApplicationFormSnapshot,
  AtsAdapter,
  AtsProvider,
  FormFieldDefinition,
  FormFieldOption,
  FormFieldType,
  RawField,
} from "./types";

export {
  ATS_PROVIDERS,
  FORM_FIELD_TYPES,
  applicationFormSnapshotSchema,
} from "./types";
