# Rakshak AI - Complete Supabase Schema Documentation

## Overview

This document provides the complete Supabase database schema for Rakshak AI, including all tables, indexes, policies, and relationships required for the emergency response application.

---

## Table of Contents

1. [Emergency Events Table](#emergency-events-table)
2. [Location History Table](#location-history-table)
3. [Trip Sharing Table](#trip-sharing-table)
4. [Guardians Table](#guardians-table)
5. [Safety Monitoring Table](#safety-monitoring-table)
6. [Setup Instructions](#setup-instructions)
7. [Security Policies](#security-policies)
8. [Indexes and Performance](#indexes-and-performance)

---

## Emergency Events Table

Stores emergency SOS events with visual triage data and location information.

```sql
-- Create emergency_events table
CREATE TABLE emergency_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL DEFAULT 'SOS',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  
  -- Location data
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2),
  altitude DECIMAL(10, 2),
  heading DECIMAL(10, 2),
  speed DECIMAL(10, 2),
  
  -- Visual triage data
  front_camera_url TEXT,
  rear_camera_url TEXT,
  audio_recording_url TEXT,
  
  -- Additional data
  metadata JSONB DEFAULT '{}',
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
);

-- Create indexes
CREATE INDEX idx_emergency_events_session_id ON emergency_events(session_id);
CREATE INDEX idx_emergency_events_status ON emergency_events(status);
CREATE INDEX idx_emergency_events_created_at ON emergency_events(created_at DESC);
CREATE INDEX idx_emergency_events_location ON emergency_events(latitude, longitude);

-- Enable RLS
ALTER TABLE emergency_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public insert" ON emergency_events
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read" ON emergency_events
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public update" ON emergency_events
  FOR UPDATE
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_emergency_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_emergency_events_updated_at
  BEFORE UPDATE ON emergency_events
  FOR EACH ROW
  EXECUTE FUNCTION update_emergency_events_updated_at();

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE emergency_events;
```

### Fields Description

- **id**: UUID primary key
- **session_id**: Anonymous session identifier
- **event_type**: Type of emergency (SOS, AUTO_SOS, MANUAL)
- **status**: Event status (active, resolved, cancelled)
- **latitude/longitude**: GPS coordinates
- **accuracy**: GPS accuracy in meters
- **altitude**: Altitude in meters
- **heading**: Direction in degrees
- **speed**: Speed in km/h
- **front_camera_url**: URL to front camera image
- **rear_camera_url**: URL to rear camera image
- **audio_recording_url**: URL to audio recording
- **metadata**: Additional JSON data
- **notes**: Text notes
- **created_at**: Event creation timestamp
- **updated_at**: Last update timestamp
- **resolved_at**: Resolution timestamp

---

## Location History Table

Stores GPS breadcrumb trail for path recovery and tracking.

```sql
-- Create location_history table
CREATE TABLE location_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  
  -- Location data
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2),
  altitude DECIMAL(10, 2),
  heading DECIMAL(10, 2),
  speed DECIMAL(10, 2),
  
  -- Additional data
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
);

-- Create indexes
CREATE INDEX idx_location_history_session_id ON location_history(session_id);
CREATE INDEX idx_location_history_recorded_at ON location_history(recorded_at DESC);
CREATE INDEX idx_location_history_location ON location_history(latitude, longitude);

-- Enable RLS
ALTER TABLE location_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public insert" ON location_history
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read own" ON location_history
  FOR SELECT
  USING (session_id = current_setting('app.session_id'));

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE location_history;
```

### Fields Description

- **id**: UUID primary key
- **session_id**: Anonymous session identifier
- **latitude/longitude**: GPS coordinates
- **accuracy**: GPS accuracy in meters
- **altitude**: Altitude in meters
- **heading**: Direction in degrees
- **speed**: Speed in km/h
- **metadata**: Additional JSON data
- **recorded_at**: When location was recorded
- **synced_at**: When location was synced to server

---

## Trip Sharing Table

Stores trip sharing sessions for guardian tracking.

```sql
-- Create trip_sharing table
CREATE TABLE trip_sharing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id VARCHAR(8) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  
  -- Current location
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  accuracy DECIMAL(10, 2),
  last_updated TIMESTAMP WITH TIME ZONE,
  
  -- Trip details
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional data
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
);

-- Create indexes
CREATE INDEX idx_trip_sharing_tracking_id ON trip_sharing(tracking_id);
CREATE INDEX idx_trip_sharing_status ON trip_sharing(status);
CREATE INDEX idx_trip_sharing_expires_at ON trip_sharing(expires_at);

-- Enable RLS
ALTER TABLE trip_sharing ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public insert" ON trip_sharing
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read" ON trip_sharing
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public update" ON trip_sharing
  FOR UPDATE
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_trip_sharing_updated_at
  BEFORE UPDATE ON trip_sharing
  FOR EACH ROW
  EXECUTE FUNCTION update_trip_updated_at();

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE trip_sharing;
```

### Fields Description

- **id**: UUID primary key
- **tracking_id**: 8-character unique tracking ID
- **status**: Trip status (active, completed, expired)
- **current_latitude/longitude**: Current GPS coordinates
- **accuracy**: GPS accuracy in meters
- **last_updated**: Last location update timestamp
- **expires_at**: When tracking link expires
- **completed_at**: When trip was completed
- **metadata**: Trip notes, destination, etc.
- **created_at**: Trip creation timestamp
- **updated_at**: Last update timestamp

---

## Guardians Table

Stores emergency contact information for guardian notifications.

```sql
-- Create guardians table
CREATE TABLE guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  
  -- Contact information
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  relationship VARCHAR(100),
  
  -- Status
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Additional data
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
);

-- Create indexes
CREATE INDEX idx_guardians_session_id ON guardians(session_id);
CREATE INDEX idx_guardians_is_active ON guardians(is_active);
CREATE INDEX idx_guardians_is_primary ON guardians(is_primary);

-- Enable RLS
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public insert own" ON guardians
  FOR INSERT
  WITH CHECK (session_id = current_setting('app.session_id'));

CREATE POLICY "Allow public read own" ON guardians
  FOR SELECT
  USING (session_id = current_setting('app.session_id'));

CREATE POLICY "Allow public update own" ON guardians
  FOR UPDATE
  WITH CHECK (session_id = current_setting('app.session_id'));

-- Create trigger for updated_at
CREATE TRIGGER update_guardians_updated_at
  BEFORE UPDATE ON guardians
  FOR EACH ROW
  EXECUTE FUNCTION update_guardians_updated_at();

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE guardians;
```

### Fields Description

- **id**: UUID primary key
- **session_id**: Anonymous session identifier
- **name**: Guardian's name
- **phone**: Guardian's phone number
- **email**: Guardian's email
- **relationship**: Relationship to user
- **is_primary**: Whether this is the primary guardian
- **is_active**: Whether guardian is active
- **metadata**: Additional JSON data
- **created_at**: Guardian creation timestamp
- **updated_at**: Last update timestamp

---

## Safety Monitoring Table

Stores safety monitoring events and alerts.

```sql
-- Create safety_monitoring table
CREATE TABLE safety_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  
  -- Alert details
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  
  -- Location data
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Alert data
  metadata JSONB DEFAULT '{}',
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
);

-- Create indexes
CREATE INDEX idx_safety_monitoring_session_id ON safety_monitoring(session_id);
CREATE INDEX idx_safety_monitoring_alert_type ON safety_monitoring(alert_type);
CREATE INDEX idx_safety_monitoring_severity ON safety_monitoring(severity);
CREATE INDEX idx_safety_monitoring_status ON safety_monitoring(status);
CREATE INDEX idx_safety_monitoring_created_at ON safety_monitoring(created_at DESC);

-- Enable RLS
ALTER TABLE safety_monitoring ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public insert own" ON safety_monitoring
  FOR INSERT
  WITH CHECK (session_id = current_setting('app.session_id'));

CREATE POLICY "Allow public read own" ON safety_monitoring
  FOR SELECT
  USING (session_id = current_setting('app.session_id'));

CREATE POLICY "Allow public update own" ON safety_monitoring
  FOR UPDATE
  WITH CHECK (session_id = current_setting('app.session_id'));

-- Create trigger for updated_at
CREATE TRIGGER update_safety_monitoring_updated_at
  BEFORE UPDATE ON safety_monitoring
  FOR EACH ROW
  EXECUTE FUNCTION update_safety_monitoring_updated_at();

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE safety_monitoring;
```

### Fields Description

- **id**: UUID primary key
- **session_id**: Anonymous session identifier
- **alert_type**: Type of safety alert
- **severity**: Alert severity (low, medium, high, critical)
- **status**: Alert status (active, resolved, ignored)
- **latitude/longitude**: GPS coordinates
- **metadata**: Additional JSON data
- **notes**: Text notes
- **created_at**: Alert creation timestamp
- **updated_at**: Last update timestamp
- **resolved_at**: Resolution timestamp

---

## Setup Instructions

### Prerequisites

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from project settings
3. Open the SQL Editor in your Supabase dashboard

### Installation Steps

1. **Create all tables:**
   - Copy each SQL block from this document
   - Run in Supabase SQL Editor
   - Execute in order: emergency_events → location_history → trip_sharing → guardians → safety_monitoring

2. **Enable real-time:**
   - Go to Database > Replication
   - Enable real-time for all tables
   - Verify tables appear in real-time publication

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key
   - Configure other variables as needed

4. **Test connection:**
   - Run `npm run dev`
   - Check browser console for connection status
   - Verify no database errors

---

## Security Policies

### Current Policies

**Public Access (Development):**
- All tables allow public insert, read, and update
- No authentication required (anonymous sessions)
- Suitable for hackathon/demo purposes

**Production Recommendations:**

1. **Add Authentication:**
   ```sql
   -- Enable Supabase Auth
   -- Add user_id foreign key to all tables
   -- Update policies to check user_id
   ```

2. **Row-Level Security:**
   ```sql
   CREATE POLICY "Users can only access their own data"
     ON emergency_events
     FOR ALL
     USING (user_id = auth.uid());
   ```

3. **API Rate Limiting:**
   - Implement rate limiting at application level
   - Use Supabase Edge Functions for API protection
   - Add request throttling

4. **Data Encryption:**
   - Encrypt sensitive data at rest
   - Use Supabase's built-in encryption
   - Implement field-level encryption

---

## Indexes and Performance

### Current Indexes

All tables include indexes for:
- Primary keys (UUID)
- Foreign keys (session_id)
- Common query fields (status, created_at)
- Location data (latitude, longitude)

### Performance Recommendations

1. **Add Composite Indexes:**
   ```sql
   CREATE INDEX idx_emergency_events_session_status 
     ON emergency_events(session_id, status);
   ```

2. **Add Partial Indexes:**
   ```sql
   CREATE INDEX idx_active_emergency_events 
     ON emergency_events(created_at DESC)
     WHERE status = 'active';
   ```

3. **Add GIN Indexes for JSONB:**
   ```sql
   CREATE INDEX idx_emergency_events_metadata 
     ON emergency_events USING GIN (metadata);
   ```

4. **Implement Partitioning:**
   - Partition location_history by date
   - Partition emergency_events by month
   - Improves query performance for large datasets

5. **Add Materialized Views:**
   ```sql
   CREATE MATERIALIZED VIEW active_emergencies AS
   SELECT * FROM emergency_events WHERE status = 'active';
   ```

---

## Maintenance

### Regular Tasks

1. **Clean up old data:**
   ```sql
   -- Delete location history older than 30 days
   DELETE FROM location_history 
   WHERE recorded_at < NOW() - INTERVAL '30 days';
   ```

2. **Archive resolved events:**
   ```sql
   -- Move resolved events to archive table
   INSERT INTO emergency_events_archive
   SELECT * FROM emergency_events 
   WHERE status = 'resolved' AND resolved_at < NOW() - INTERVAL '90 days';
   ```

3. **Update statistics:**
   ```sql
   ANALYZE emergency_events;
   ANALYZE location_history;
   ANALYZE trip_sharing;
   ANALYZE guardians;
   ANALYZE safety_monitoring;
   ```

### Monitoring

1. **Monitor table sizes:**
   ```sql
   SELECT 
     schemaname,
     tablename,
     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
   FROM pg_tables
   WHERE schemaname = 'public'
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
   ```

2. **Monitor query performance:**
   ```sql
   SELECT query, mean_exec_time, calls
   FROM pg_stat_statements
   ORDER BY mean_exec_time DESC
   LIMIT 10;
   ```

---

## Backup and Recovery

### Backup Strategy

1. **Automated Backups:**
   - Enable Supabase automated backups (included in Pro plan)
   - Set retention period to 30 days
   - Enable point-in-time recovery

2. **Manual Backups:**
   ```sql
   -- Export schema
   pg_dump --schema-only > schema.sql
   
   -- Export data
   pg_dump --data-only > data.sql
   ```

3. **Restore Process:**
   ```sql
   -- Restore schema
   psql -f schema.sql
   
   -- Restore data
   psql -f data.sql
   ```

---

## Troubleshooting

### Common Issues

1. **Connection Timeout:**
   - Check Supabase project status
   - Verify network connectivity
   - Check firewall settings

2. **RLS Policy Errors:**
   - Verify policies are correctly configured
   - Check session_id is set correctly
   - Review policy logic

3. **Real-time Not Working:**
   - Verify real-time is enabled
   - Check publication includes tables
   - Verify client subscription

4. **Performance Issues:**
   - Check query execution plans
   - Verify indexes are being used
   - Consider adding more indexes

---

## Version History

- **v1.0.0** - Initial schema for Rakshak AI
- **v1.1.0** - Added safety monitoring table
- **v1.2.0** - Added trip sharing functionality
- **v1.3.0** - Enhanced indexes and performance

---

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review PostgreSQL documentation: https://www.postgresql.org/docs/
- Open an issue in the Rakshak AI repository
