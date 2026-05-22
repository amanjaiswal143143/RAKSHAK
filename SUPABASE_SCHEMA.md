# Supabase Schema for Rakshak AI

## Setup Instructions

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL commands below to set up the database schema
4. Copy your project URL and anon key from Settings > API
5. Create a `.env` file in the project root with:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Database Schema

### Table: emergencies

Stores all emergency SOS reports with location data and status.

```sql
-- Create emergencies table
CREATE TABLE emergencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL DEFAULT 'SOS',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  accuracy DECIMAL(10, 2),
  altitude DECIMAL(10, 2),
  altitude_accuracy DECIMAL(10, 2),
  heading DECIMAL(10, 2),
  speed DECIMAL(10, 2),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_emergencies_timestamp ON emergencies(timestamp DESC);
CREATE INDEX idx_emergencies_status ON emergencies(status);
CREATE INDEX idx_emergencies_type ON emergencies(type);
CREATE INDEX idx_emergencies_location ON emergencies(latitude, longitude);

-- Enable Row Level Security
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting emergencies (public access for SOS)
CREATE POLICY "Allow public insert" ON emergencies
  FOR INSERT
  WITH CHECK (true);

-- Create policy for reading emergencies (public access)
CREATE POLICY "Allow public read" ON emergencies
  FOR SELECT
  USING (true);

-- Create policy for updating emergencies (public access)
CREATE POLICY "Allow public update" ON emergencies
  FOR UPDATE
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_emergencies_updated_at
  BEFORE UPDATE ON emergencies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Table: emergency_contacts (Optional)

Stores emergency contact information for users.

```sql
-- Create emergency_contacts table
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  relationship VARCHAR(50),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_emergency_contacts_user_id ON emergency_contacts(user_id);

-- Enable RLS
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Policies for emergency contacts
CREATE POLICY "Allow public read" ON emergency_contacts
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert" ON emergency_contacts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update" ON emergency_contacts
  FOR UPDATE
  WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_emergency_contacts_updated_at
  BEFORE UPDATE ON emergency_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Table: location_history (Optional)

Stores location history for tracking purposes.

```sql
-- Create location_history table
CREATE TABLE location_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Create indexes
CREATE INDEX idx_location_history_user_id ON location_history(user_id);
CREATE INDEX idx_location_history_timestamp ON location_history(timestamp DESC);

-- Enable RLS
ALTER TABLE location_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read" ON location_history
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert" ON location_history
  FOR INSERT
  WITH CHECK (true);
```

## Storage Buckets (Optional)

### Bucket: emergency_images

For storing photos/videos during emergencies.

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('emergency_images', 'emergency_images', true);

-- Policies for storage
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'emergency_images');

CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'emergency_images');
```

## Real-time Subscriptions

Enable real-time functionality for emergencies table:

```sql
-- Enable real-time for emergencies table
ALTER PUBLICATION supabase_realtime ADD TABLE emergencies;
```

## Testing the Schema

After running the SQL commands, test the schema:

```sql
-- Insert a test emergency
INSERT INTO emergencies (type, status, latitude, longitude, accuracy, metadata)
VALUES ('SOS', 'active', 13.0827, 80.2707, 10.5, '{"source": "test"}');

-- Query emergencies
SELECT * FROM emergencies ORDER BY timestamp DESC LIMIT 10;

-- Update emergency status
UPDATE emergencies SET status = 'resolved' WHERE id = 'your-emergency-id';
```

## Security Notes

- The current policies allow public access for emergency reporting
- For production, consider implementing authentication
- Add rate limiting to prevent abuse
- Implement proper user management for contact storage
- Consider adding IP-based restrictions for sensitive operations
