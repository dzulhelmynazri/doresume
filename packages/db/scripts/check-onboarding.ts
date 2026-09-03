import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const sql = neon(databaseUrl);

const rows = await sql`
  SELECT
    id,
    email,
    updated_at,
    (address IS NOT NULL AND address <> '') AS has_location,
    (work_countries IS NOT NULL
      AND jsonb_array_length(work_countries) > 0) AS has_work_countries,
    citizenship IS NOT NULL AS has_citizenship,
    industries IS NOT NULL AS has_industries,
    experience_level IS NOT NULL AS has_experience,
    work_type IS NOT NULL AS has_work_type,
    education_level IS NOT NULL AS has_education,
    work_arrangement IS NOT NULL AS has_arrangement,
    minimum_salary IS NOT NULL AS has_salary,
    application_password IS NOT NULL AS has_password,
    application_settings IS NOT NULL AS has_settings,
    checklist IS NOT NULL AS has_checklist
  FROM "user"
  ORDER BY updated_at DESC
  LIMIT 5
`;

console.log(JSON.stringify(rows, null, 2));
