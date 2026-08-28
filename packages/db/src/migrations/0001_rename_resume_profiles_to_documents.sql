ALTER TABLE "user" RENAME COLUMN "resume_profiles" TO "documents";

UPDATE "user"
SET "documents" = jsonb_build_object(
  'activeDocumentId', "documents"->>'activeProfileId',
  'documents', "documents"->'profiles'
)
WHERE "documents" IS NOT NULL
  AND "documents" ? 'activeProfileId';
