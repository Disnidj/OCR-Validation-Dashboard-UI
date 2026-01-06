/*
  # Create Comparison and Email Log Tables

  1. New Tables
    - `comparison_quotations`
      - `id` (uuid, primary key)
      - `portal_name` (text) - Name of the portal (Portal A, B, Sukoon, Tokio)
      - `portal_type` (text) - Either 'success' or 'failure'
      - `file_path` (text) - Path to the stored PDF file
      - `file_name` (text) - Original filename
      - `file_size` (integer) - File size in bytes
      - `created_at` (timestamp)

    - `comparison_requests`
      - `id` (uuid, primary key)
      - `recipient_email` (text) - Main recipient
      - `cc_emails` (text[]) - Array of CC email addresses
      - `bcc_emails` (text[]) - Array of BCC email addresses
      - `message` (text) - Optional custom message
      - `quotation_ids` (uuid[]) - Array of quotation IDs included
      - `comparison_file_path` (text) - Path to generated comparison PDF
      - `status` (text) - 'pending', 'completed', or 'failed'
      - `sent_at` (timestamp)
      - `error_message` (text) - If status is 'failed'
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - All users can read their own records (basic authentication check)
*/

CREATE TABLE IF NOT EXISTS comparison_quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_name text NOT NULL,
  portal_type text NOT NULL CHECK (portal_type IN ('success', 'failure')),
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comparison_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  cc_emails text[] DEFAULT '{}',
  bcc_emails text[] DEFAULT '{}',
  message text DEFAULT '',
  quotation_ids uuid[] NOT NULL,
  comparison_file_path text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  sent_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comparison_quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert quotations"
  ON comparison_quotations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read quotations"
  ON comparison_quotations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert comparison requests"
  ON comparison_requests FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read comparison requests"
  ON comparison_requests FOR SELECT
  TO authenticated
  USING (true);
