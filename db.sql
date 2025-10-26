-- Enable UUID extension (Neon supports this by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Store bcrypt hash
    name VARCHAR(255) NOT NULL,
    location TEXT, -- e.g., "Nairobi, Kenya"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pests reference table (predefined pests with treatment guidance)
CREATE TABLE pests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    common_name VARCHAR(255) NOT NULL UNIQUE, -- e.g., "Fall Armyworm"
    scientific_name VARCHAR(255),
    treatment_guidance TEXT NOT NULL, -- e.g., "Spray neem oil every 3 days"
    prevention_tips JSONB -- Store as array: ["Rotate crops", "Use pheromone traps"]
);

-- Scans table (user uploads + AI results)
CREATE TABLE scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL, -- URL to image in cloud storage (e.g., S3, Cloudflare R2)
    pest_id UUID REFERENCES pests(id) ON DELETE SET NULL, -- NULL if unknown pest
    confidence_percent INTEGER CHECK (confidence_percent BETWEEN 0 AND 100),
    ai_raw_response JSONB, -- Store full AI model output for debugging
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather alerts table (daily risk assessments per location)
CREATE TABLE weather_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location TEXT NOT NULL, -- e.g., "Nairobi, Kenya"
    alert_type VARCHAR(100) NOT NULL, -- e.g., "High Humidity", "Heavy Rain"
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    description TEXT NOT NULL, -- e.g., "High Humidity → Blight Risk"
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Indexes for performance
CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_scanned_at ON scans(scanned_at DESC);
CREATE INDEX idx_weather_alerts_location ON weather_alerts(location);
CREATE INDEX idx_users_email ON users(email);

-- Insert sample pests (you can expand this)
INSERT INTO pests (common_name, scientific_name, treatment_guidance, prevention_tips) VALUES
(
    'Fall Armyworm',
    'Spodoptera frugiperda',
    'Apply neem oil or Bacillus thuringiensis (Bt) every 3 days until infestation is controlled.',
    '["Practice crop rotation", "Maintain field hygiene", "Use pheromone traps for monitoring"]'::jsonb
),
(
    'Aphids',
    'Aphidoidea',
    'Spray insecticidal soap or neem oil solution. Introduce natural predators like ladybugs.',
    '["Plant companion plants like marigolds", "Avoid excessive nitrogen fertilization"]'::jsonb
),
(
    'Spider Mites',
    'Tetranychus urticae', 'Increase humidity around plants. Apply miticide or horticultural oil.',
    '["Maintain proper plant spacing", "Keep plants well-watered", "Remove infested leaves promptly"]'::jsonb
);