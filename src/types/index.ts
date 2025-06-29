// Service Types
export type ServiceType = 'reparacion' | 'instalacion' | 'mantenimiento' | 'emergencia';

export type UserType = 'customer' | 'technician' | 'admin';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type ServiceStatus = 'pending' | 'confirmed' | 'en_route' | 'in_progress' | 'completed' | 'cancelled';

export type NotificationType = 'system' | 'appointment' | 'emergency' | 'marketing';

// Core interfaces
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  customer_id: string;
  technician_id?: string;
  service_type: ServiceType;
  scheduled_date: string;
  scheduled_time: string;
  location: string;
  description: string;
  status: ServiceStatus;
  estimated_price: number;
  final_price?: number;
  service_code?: string;
  booking_session_id?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  technician?: ElectricianProfile;
}

export interface ElectricianProfile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  specializations: ServiceType[];
  rating: number;
  completed_jobs: number;
  hourly_rate: number;
  is_available: boolean;
  current_location?: string;
  certifications?: string[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  user_type: UserType;
  email?: string;
  profile_picture?: string;
  is_active: boolean;
  last_login?: string;
  password_hash?: string;
  created_at: string;
  updated_at: string;
  electrician_profile?: ElectricianProfile;
  customer_profile?: CustomerProfile;
}

// New Enhanced Interfaces for Dashboard System

export interface CustomerProfile {
  id: string;
  user_id: string;
  preferred_contact_method: 'phone' | 'email' | 'whatsapp';
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  property_type: 'casa' | 'apartamento' | 'negocio' | 'oficina';
  service_preferences: ServiceType[];
  payment_method_preferences: string[];
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  customer_id?: string;
  session_id?: string;
  service_type: ServiceType;
  status: ServiceStatus;
  technician_id?: string;
  scheduled_date: string;
  scheduled_time: string;
  location: string;
  description: string;
  estimated_price: number;
  final_price?: number;
  service_code: string;
  booking_source: 'website' | 'phone' | 'whatsapp' | 'referral';
  completion_date?: string;
  warranty_expires_at?: string;
  customer_rating?: number;
  customer_feedback?: string;
  materials_used?: string[];
  work_description?: string;
  before_photos?: string[];
  after_photos?: string[];
  created_at: string;
  updated_at: string;
  customer?: Customer;
  technician?: ElectricianProfile;
}

export interface ServiceCode {
  id: string;
  code: string;
  service_request_id: string;
  is_used: boolean;
  used_by_user_id?: string;
  expires_at: string;
  created_at: string;
  used_at?: string;
}

export interface DashboardNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
  data?: any;
  action_url?: string;
  action_label?: string;
  created_at: string;
  read_at?: string;
}

export interface ServiceWarranty {
  id: string;
  service_request_id: string;
  warranty_type: 'materials' | 'labor' | 'full';
  duration_months: number;
  description: string;
  terms_conditions: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
}

export interface TechnicianAvailability {
  id: string;
  technician_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  availability_type: 'regular' | 'emergency' | 'maintenance';
  max_concurrent_jobs: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerDashboardData {
  currentServices: ServiceRequest[];
  serviceHistory: ServiceRequest[];
  activeWarranties: ServiceWarranty[];
  notifications: DashboardNotification[];
  profile: CustomerProfile;
  preferredTechnicians: ElectricianProfile[];
}

export interface TechnicianDashboardData {
  currentJobs: ServiceRequest[];
  upcomingJobs: ServiceRequest[];
  jobHistory: ServiceRequest[];
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  completedJobsCount: number;
  averageRating: number;
  notifications: DashboardNotification[];
  availability: TechnicianAvailability[];
}

export interface WorkHistoryEntry {
  id: string;
  technician_id: string;
  appointment_id: string;
  date: string;
  service_type: ServiceType;
  customer_name: string;
  location: string;
  duration_hours: number;
  earnings: number;
  rating?: number;
  notes?: string;
  created_at: string;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  technicianName?: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export interface Location {
  address: string;
  neighborhood?: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface AvailabilitySlot {
  id: string;
  technician_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobCompletion {
  id: string;
  appointment_id: string;
  technician_id: string;
  completion_date: string;
  work_description: string;
  materials_used?: string;
  customer_signature?: string;
  before_photos?: string[];
  after_photos?: string[];
  final_price: number;
  customer_rating?: number;
  customer_feedback?: string;
  created_at: string;
}

// Database table interfaces
export interface UsersTable {
  id: string;
  phone: string;
  name: string;
  user_type: UserType;
  email?: string;
  password_hash: string;
  profile_picture?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomersTable {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentsTable {
  id: string;
  customer_id: string;
  technician_id?: string;
  service_type: ServiceType;
  scheduled_date: string;
  scheduled_time: string;
  location: string;
  description: string;
  status: ServiceStatus;
  estimated_price: number;
  final_price?: number;
  service_code?: string;
  booking_session_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequestsTable {
  id: string;
  customer_id?: string;
  session_id?: string;
  service_type: ServiceType;
  status: ServiceStatus;
  technician_id?: string;
  scheduled_date: string;
  scheduled_time: string;
  location: string;
  description: string;
  estimated_price: number;
  final_price?: number;
  service_code: string;
  booking_source: 'website' | 'phone' | 'whatsapp' | 'referral';
  completion_date?: string;
  warranty_expires_at?: string;
  customer_rating?: number;
  customer_feedback?: string;
  materials_used?: string[];
  work_description?: string;
  before_photos?: string[];
  after_photos?: string[];
  created_at: string;
  updated_at: string;
}

export interface ServiceCodesTable {
  id: string;
  code: string;
  service_request_id: string;
  is_used: boolean;
  used_by_user_id?: string;
  expires_at: string;
  created_at: string;
  used_at?: string;
}

export interface CustomerProfilesTable {
  id: string;
  user_id: string;
  preferred_contact_method: 'phone' | 'email' | 'whatsapp';
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  property_type: 'casa' | 'apartamento' | 'negocio' | 'oficina';
  service_preferences: ServiceType[];
  payment_method_preferences: string[];
  created_at: string;
  updated_at: string;
}

export interface JobCompletionsTable {
  id: string;
  appointment_id: string;
  technician_id: string;
  completion_date: string;
  work_description: string;
  materials_used?: string;
  customer_signature?: string;
  before_photos?: string[];
  after_photos?: string[];
  final_price: number;
  customer_rating?: number;
  customer_feedback?: string;
  created_at: string;
}

export interface NotificationsTable {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  action_url?: string;
  action_label?: string;
  related_service_id?: string;
  created_at: string;
  read_at?: string;
}

export interface ServiceWarrantiesTable {
  id: string;
  service_request_id: string;
  warranty_type: 'materials' | 'labor' | 'full';
  duration_months: number;
  description: string;
  terms_conditions: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
}

export interface TechnicianAvailabilityTable {
  id: string;
  technician_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  availability_type: 'regular' | 'emergency' | 'maintenance';
  max_concurrent_jobs: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AvailabilitySlotsTable {
  id: string;
  technician_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// Constants
export const SERVICE_TRANSLATIONS: Record<ServiceType, string> = {
  reparacion: 'Reparación Eléctrica',
  instalacion: 'Instalación Eléctrica', 
  mantenimiento: 'Mantenimiento',
  emergencia: 'Emergencia 24/7'
};

export const SERVICE_PRICING: Record<ServiceType, { min: number; description: string }> = {
  instalacion: { min: 2000, description: 'Instalación Eléctrica completa' },
  reparacion: { min: 800, description: 'Reparación de problemas eléctricos' },
  emergencia: { min: 1500, description: 'Servicio de emergencia 24/7' },
  mantenimiento: { min: 600, description: 'Mantenimiento preventivo' }
};

export const STATUS_TRANSLATIONS: Record<ServiceStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  en_route: 'En Camino',
  in_progress: 'En Progreso',
  completed: 'Completado',
  cancelled: 'Cancelado'
};

export const NOTIFICATION_TRANSLATIONS: Record<NotificationType, string> = {
  system: 'Sistema',
  appointment: 'Cita',
  emergency: 'Emergencia',
  marketing: 'Marketing'
}; 