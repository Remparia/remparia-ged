CREATE TABLE IF NOT EXISTS founder_applications (
  id uuid PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  work_email text NOT NULL,
  company_name text NOT NULL,
  job_title text NOT NULL,
  company_size text NOT NULL,
  industry text NOT NULL,
  document_locations text[] NOT NULL DEFAULT '{}',
  primary_challenge text NOT NULL,
  monthly_volume text NOT NULL,
  use_case text NOT NULL,
  involvement_role text NOT NULL,
  interview_availability text NOT NULL,
  codesign_commitment text NOT NULL,
  status text NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED','SHORTLISTED','ACCEPTED','DECLINED')),
  qualification_score integer NOT NULL DEFAULT 0,
  qualification_recommendation text NOT NULL,
  qualification_reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  consent_at timestamptz NOT NULL,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS founder_applications_created_idx ON founder_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS founder_applications_email_idx ON founder_applications (lower(work_email));
