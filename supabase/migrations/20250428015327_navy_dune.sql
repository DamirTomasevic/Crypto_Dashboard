-- Supabase migration to create tables and policies for MORE token dashboard
-- Reordered to ensure admin_users table exists before policies reference it

-- Admin Users (for data update permissions)
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM admin_users
  ));

-- Token Snapshots (periodic metrics)
CREATE TABLE IF NOT EXISTS token_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  price numeric(38,18) NOT NULL,
  market_cap numeric(38,2) NOT NULL,
  total_supply numeric(38,0) NOT NULL,
  circulating_supply numeric(38,0) NOT NULL,
  burned_amount numeric(38,0) NOT NULL,
  burn_percentage numeric(5,2) NOT NULL,
  holder_count integer NOT NULL,
  volume_24h numeric(38,2) NOT NULL,
  liquidity numeric(38,2) NOT NULL
);

ALTER TABLE token_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read token_snapshots"
  ON token_snapshots
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can insert token_snapshots"
  ON token_snapshots
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM admin_users
  ));

-- Token Transfers (recent transactions)
CREATE TABLE IF NOT EXISTS token_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hash text NOT NULL UNIQUE,
  block_number bigint NOT NULL,
  timestamp timestamptz DEFAULT now(),
  from_address text NOT NULL,
  to_address text NOT NULL,
  value numeric(38,0) NOT NULL,
  token_name text NOT NULL DEFAULT 'MORE',
  token_symbol text NOT NULL DEFAULT 'MORE',
  token_decimal integer NOT NULL DEFAULT 18,
  is_burn boolean DEFAULT false
);

ALTER TABLE token_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read token_transfers"
  ON token_transfers
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can insert token_transfers"
  ON token_transfers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM admin_users
  ));

-- Token Holders (top holders)
CREATE TABLE IF NOT EXISTS token_holders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address text NOT NULL UNIQUE,
  balance numeric(38,0) NOT NULL,
  percentage numeric(5,2) NOT NULL,
  tag text,
  first_transaction_date timestamptz,
  last_transaction_date timestamptz,
  transaction_count integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE token_holders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read token_holders"
  ON token_holders
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can update token_holders"
  ON token_holders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM admin_users
  ));

-- Price History (candles)
CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL,
  open numeric(38,18) NOT NULL,
  high numeric(38,18) NOT NULL,
  low numeric(38,18) NOT NULL,
  close numeric(38,18) NOT NULL,
  volume numeric(38,2) NOT NULL,
  interval_type text NOT NULL,
  UNIQUE(timestamp, interval_type)
);

ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read price_history"
  ON price_history
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can insert price_history"
  ON price_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM admin_users
  ));

-- User Watchlists (saved wallets to monitor)
CREATE TABLE IF NOT EXISTS user_watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  address text NOT NULL,
  label text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, address)
);

ALTER TABLE user_watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own watchlists"
  ON user_watchlists
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS token_transfers_from_address_idx ON token_transfers(from_address);
CREATE INDEX IF NOT EXISTS token_transfers_to_address_idx ON token_transfers(to_address);
CREATE INDEX IF NOT EXISTS token_transfers_timestamp_idx ON token_transfers(timestamp);
CREATE INDEX IF NOT EXISTS price_history_timestamp_idx ON price_history(timestamp);
CREATE INDEX IF NOT EXISTS token_snapshots_timestamp_idx ON token_snapshots(timestamp);