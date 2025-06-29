-- Create users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'technician', 'admin')),
    email TEXT,
    password_hash TEXT NOT NULL, -- Secure password storage
    profile_picture TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create customers table
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    address TEXT,
    is_returning BOOLEAN DEFAULT FALSE,
    previous_jobs INTEGER DEFAULT 0,
    payment_history TEXT DEFAULT 'good' CHECK (payment_history IN ('good', 'fair', 'poor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create customer_profiles table
CREATE TABLE customer_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    preferred_contact_method TEXT DEFAULT 'whatsapp' CHECK (preferred_contact_method IN ('phone', 'email', 'whatsapp')),
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    property_type TEXT DEFAULT 'casa' CHECK (property_type IN ('casa', 'apartamento', 'negocio', 'oficina')),
    service_preferences TEXT[] DEFAULT ARRAY[]::TEXT[],
    payment_method_preferences TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create electrician_profiles table
CREATE TABLE electrician_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    business_name TEXT,
    license_number TEXT,
    specialties TEXT[] DEFAULT ARRAY[]::TEXT[],
    service_area TEXT DEFAULT 'Santo Domingo',
    hourly_rate DECIMAL(10,2) DEFAULT 1200.00,
    availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')),
    rating DECIMAL(3,2) DEFAULT 5.0,
    total_jobs INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    current_location TEXT,
    certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
    completed_jobs INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customer_profiles_user_id ON customer_profiles(user_id);
CREATE INDEX idx_electrician_profiles_user_id ON electrician_profiles(user_id);
CREATE INDEX idx_electrician_profiles_availability ON electrician_profiles(availability_status);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE electrician_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR auth.uid()::text = phone);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text OR auth.uid()::text = phone);

CREATE POLICY "Allow user creation" ON users
    FOR INSERT WITH CHECK (true);

-- RLS Policies for customers
CREATE POLICY "Customers can view own data" ON customers
    FOR SELECT USING (auth.uid()::text = phone OR auth.uid()::text = id::text);

CREATE POLICY "Allow customer creation" ON customers
    FOR INSERT WITH CHECK (true);

-- RLS Policies for customer_profiles
CREATE POLICY "Customer profiles can view own data" ON customer_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Customer profiles can update own data" ON customer_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Allow customer profile creation" ON customer_profiles
    FOR INSERT WITH CHECK (true);

-- RLS Policies for electrician_profiles
CREATE POLICY "Electrician profiles can view own data" ON electrician_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Electrician profiles can update own data" ON electrician_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Allow electrician profile creation" ON electrician_profiles
    FOR INSERT WITH CHECK (true);

-- Public can view electrician profiles for booking
CREATE POLICY "Public can view electrician profiles" ON electrician_profiles
    FOR SELECT USING (true);

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON customer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_electrician_profiles_updated_at BEFORE UPDATE ON electrician_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO users (phone, name, user_type, email) VALUES 
('8095550123', 'Juan Pérez', 'technician', 'juan@multiservicios.com'),
('8095550124', 'María González', 'customer', 'maria@example.com');

INSERT INTO electrician_profiles (user_id, name, phone, email, business_name, specialties, service_area, hourly_rate, rating, total_jobs)
SELECT id, name, phone, email, 'Servicios ' || name, ARRAY['Reparaciones', 'Instalaciones'], 'El Seibo', 1200.00, 5.0, 15
FROM users WHERE user_type = 'technician' AND name = 'Juan Pérez';

INSERT INTO customer_profiles (user_id, full_name, phone, email, address)
SELECT id, name, phone, email, 'El Seibo, República Dominicana'
FROM users WHERE user_type = 'customer' AND name = 'María González'; 