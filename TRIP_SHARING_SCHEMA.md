# Trip Sharing Schema for Rakshak AI

## Setup Instructions

1. Go to SQL Editor in your Supabase dashboard
2. Run the SQL commands below to set up the trip sharing table
3. Enable real-time subscriptions for live tracking

## Database Schema

### Table: trip_sharing

Stores active trip sharing sessions with real-time location updates.

```sql
-- Create trip_sharing table
CREATE TABLE trip_sharing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id VARCHAR(8) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  accuracy DECIMAL(10, 2),
  last_updated TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_trip_sharing_tracking_id ON trip_sharing(tracking_id);
CREATE INDEX idx_trip_sharing_status ON trip_sharing(status);
CREATE INDEX idx_trip_sharing_expires_at ON trip_sharing(expires_at);

-- Enable Row Level Security
ALTER TABLE trip_sharing ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (anyone can create a trip)
CREATE POLICY "Allow public insert" ON trip_sharing
  FOR INSERT
  WITH CHECK (true);

-- Create policy for public read (anyone can track a trip)
CREATE POLICY "Allow public read" ON trip_sharing
  FOR SELECT
  USING (true);

-- Create policy for public update (trip owner can update location)
CREATE POLICY "Allow public update" ON trip_sharing
  FOR UPDATE
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_trip_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_trip_sharing_updated_at
  BEFORE UPDATE ON trip_sharing
  FOR EACH ROW
  EXECUTE FUNCTION update_trip_updated_at();

-- Enable real-time for trip_sharing table
ALTER PUBLICATION supabase_realtime ADD TABLE trip_sharing;
```

## Schema Fields

- **id**: UUID primary key
- **tracking_id**: 8-character unique tracking ID for URL
- **status**: 'active', 'completed', 'expired'
- **current_latitude**: Current GPS latitude
- **current_longitude**: Current GPS longitude
- **accuracy**: GPS accuracy in meters
- **last_updated**: Timestamp of last location update
- **expires_at**: When the tracking link expires (24 hours default)
- **completed_at**: When trip was manually ended
- **metadata**: JSONB for trip notes, destination, etc.
- **created_at**: Trip creation timestamp
- **updated_at**: Last update timestamp

## Security Notes

- **Public Access**: Anyone can create and track trips (no login required)
- **Expiration**: Links auto-expire after 24 hours
- **Rate Limiting**: Consider adding rate limiting in production
- **Privacy**: Only location data is shared, no personal information
- **Recommendations**:
  - Add CAPTCHA for trip creation to prevent abuse
  - Implement IP-based rate limiting
  - Add option for password-protected trips
  - Consider adding trip duration limits
  - Monitor for suspicious activity patterns
