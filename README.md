# ⚡ MultiServicios El Seibo - Electrical Services WebApp

A modern Next.js 15 web application for an electrical services business based in El Seibo, Dominican Republic. This webapp enables customers to book electrical services and allows technicians to manage their jobs efficiently.

## 🚀 Features

### Customer Features
- **Professional Scheduling**: Calendly integration for reliable appointment booking
- **Service Selection**: Choose from installation, repair, maintenance, or emergency services
- **Real-time Availability**: Professional calendar with conflict detection and double-booking prevention
- **WhatsApp Integration**: Direct contact for emergencies and quick consultations
- **Responsive Design**: Mobile-first approach optimized for Dominican users

### Technician Features
- **Job Management Dashboard**: View and manage pending jobs
- **Earnings Tracking**: Monitor daily and weekly earnings
- **Schedule Management**: Today's agenda with detailed appointment information
- **Customer Communication**: Direct calling functionality
- **Job Actions**: Accept, reject, or call customers for each job

### Technical Features
- **Spanish Localization**: Complete Dominican Spanish (es-DO) interface
- **Professional UI**: Modern design with electrical service branding
- **Real-time Updates**: Live job status and availability updates
- **Mock Data**: Realistic Dominican names, locations, and pricing
- **Responsive Grid**: Adaptive layouts for all screen sizes

## 🛠 Tech Stack

- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.1.11
- **Backend**: Supabase 2.50.2
- **State Management**: Zustand 5.0.6
- **Icons**: Lucide React 0.523.0
- **Utilities**: clsx, class-variance-authority

## 📦 Installation

1. **Clone or create the project directory**:
```bash
mkdir multiservicios-webapp
cd multiservicios-webapp
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

4. **Setup Calendly** (Required for booking functionality):
Follow the detailed guide in `CALENDLY_SETUP.md` to configure your Calendly account.

5. **Open your browser**:
Navigate to [http://localhost:3001](http://localhost:3001) to view the application.

## 🏗 Project Structure

```
webapp/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Geist fonts
│   │   ├── page.tsx            # Home/Landing page
│   │   ├── globals.css         # Tailwind + custom CSS
│   │   ├── booking/
│   │   │   └── page.tsx        # Service booking page
│   │   └── dashboard/
│   │       └── page.tsx        # Technician dashboard
│   ├── components/
│   │   ├── CalendlyEmbed.tsx   # Calendly integration component
│   │   └── TechnicianDashboard.tsx # Job management dashboard
│   ├── lib/
│   │   └── supabase.ts         # Supabase client + database types
│   ├── store/
│   │   └── auth.ts             # Zustand auth store
│   ├── types/
│   │   └── index.ts            # Complete TypeScript interfaces
│   └── utils/
│       └── cn.ts               # clsx utility function
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── eslint.config.mjs
```

## 🎯 Key Pages & Components

### Home Page (`/`)
- **Header**: Navigation with logo and menu
- **Hero Section**: Professional service description
- **Feature Cards**: Customer booking, technician panel, services info
- **Services Grid**: Four main services with Dominican pricing
- **Contact Section**: WhatsApp integration button
- **Footer**: Company information

### Booking Page (`/booking`)
- **Calendar Component**: Interactive 7-day date selector
- **Time Slots**: Available appointments with assigned technicians
- **Service Form**: Service type, location, and description
- **Real-time Validation**: Form validation and submission
- **Confirmation**: Success message and form reset

### Dashboard Page (`/dashboard`)
- **Welcome Header**: Personalized technician greeting
- **Stats Cards**: Pending jobs, daily earnings, weekly totals
- **Tabbed Interface**: 
  - Trabajos Pendientes (Pending Jobs)
  - Agenda de Hoy (Today's Schedule)
  - Ganancias (Earnings)
- **Job Cards**: Detailed job information with action buttons

## 💰 Dominican Pricing

All prices are displayed in Dominican Pesos (RD$):

- **Instalación Eléctrica**: Desde RD$2,000
- **Reparación de Breakers**: Desde RD$800
- **Emergencias 24/7**: Desde RD$1,500
- **Mantenimiento**: Desde RD$600

## 🎨 Design System

### Colors
- **Primary Blue**: #3b82f6 (Electrical theme)
- **Success Green**: #10b981 (Earnings, available)
- **Warning Orange**: #f59e0b (Medium priority)
- **Emergency Red**: #ef4444 (High priority, emergencies)
- **Purple Accent**: #8b5cf6 (Weekly totals, info)

### Typography
- **Primary Font**: Geist Sans (optimized for Spanish)
- **Monospace**: Geist Mono
- **Localization**: Dominican Republic (es-DO)

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Smooth transitions and hover states
- **Forms**: Focus rings and validation states
- **Responsive**: Mobile-first with adaptive grids

## 🌐 Spanish Localization

- **Complete Spanish Interface**: All text in Dominican Spanish
- **Date Formatting**: es-DO locale for dates and times
- **Currency**: Dominican Peso (RD$) formatting
- **Phone Numbers**: Dominican format (+1 809 xxx-xxxx)
- **Professional Terms**: Electrical service terminology in Spanish

## 🔧 Mock Data

The application includes realistic mock data:

### Sample Jobs
1. **María González** - Instalación Eléctrica (Alta prioridad) - RD$2,500
2. **Carlos Martínez** - Reparación (Media prioridad) - RD$1,200
3. **Ana Rodríguez** - Emergencia (Emergencia) - RD$4,000

### Technicians
- **Juan Pérez** (Default dashboard technician)
- **Carlos González** (Available in calendar)

### Locations
- El Seibo addresses with authentic Dominican street names
- Realistic phone numbers in Dominican format

## 📱 Responsive Design

- **Mobile First**: Optimized for smartphone usage
- **Tablet Support**: Adapted layouts for medium screens
- **Desktop Enhanced**: Full feature set on larger screens
- **Touch Friendly**: Large buttons and easy navigation

## 🔐 Authentication Store

Zustand-powered authentication with:
- **Phone-based Auth**: Dominican phone number login
- **User Types**: Customer, Technician, Admin
- **Session Persistence**: Maintains login state
- **Profile Management**: User information updates

## 🗄 Database Schema

Complete TypeScript interfaces for:
- **Users**: Authentication and profiles
- **Customers**: Client information
- **Appointments**: Service bookings
- **Job Completions**: Work history
- **Notifications**: System messages
- **Availability Slots**: Technician schedules

## 📞 WhatsApp Integration

- **Emergency Contact**: +1 (809) 555-0123
- **Quick Messaging**: Pre-formatted service inquiry messages
- **Professional Communication**: Business-appropriate templates

## 🚀 Development Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 🌟 Key Features in Detail

### Calendar Booking Component
- **7-Day View**: Shows next week's availability
- **Time Slots**: 30-minute intervals from 8 AM to 6 PM
- **Availability Logic**: 70% chance for full hours, 60% for half hours
- **Technician Assignment**: Shows assigned technician for each slot
- **Spanish Date Names**: Uses es-DO locale formatting

### Technician Dashboard Component
- **Real-time Stats**: Live calculation of earnings and job counts
- **Interactive Tabs**: Smooth transitions between different views
- **Job Management**: Accept, reject, and call customer actions
- **Urgency Indicators**: Color-coded priority levels
- **Earnings Breakdown**: Service type analysis

## 🎯 Business Logic

### Service Types
- **Reparación**: Electrical repairs and troubleshooting
- **Instalación**: New electrical installations
- **Mantenimiento**: Preventive maintenance services
- **Emergencia**: 24/7 emergency electrical services

### Pricing Strategy
- **Transparent Pricing**: Clear starting prices for each service
- **Dominican Market**: Competitive rates in local currency
- **Emergency Premium**: Higher rates for 24/7 services
- **Estimated Costs**: Preliminary pricing before final quote

## 🔧 Customization

The application is designed to be easily customizable:

1. **Branding**: Update logo, colors, and company information
2. **Services**: Modify service types and pricing in `types/index.ts`
3. **Locations**: Update default locations and service areas
4. **Technicians**: Add or modify technician profiles
5. **Pricing**: Adjust service rates for local market

## 📊 Analytics & Monitoring

The application includes tracking for:
- **Job Completion Rates**: Success metrics
- **Customer Satisfaction**: Ratings and feedback
- **Technician Performance**: Earnings and efficiency
- **Service Demand**: Popular service analysis

## 🛡 Security Features

- **Phone Authentication**: Secure login system
- **Input Validation**: Form security and data integrity
- **Type Safety**: Complete TypeScript coverage
- **Error Handling**: Graceful error management

## 📈 Future Enhancements

Potential features for expansion:
- **Real-time Chat**: Customer-technician communication
- **GPS Tracking**: Live technician location
- **Payment Processing**: Online payment integration
- **Review System**: Customer feedback and ratings
- **Inventory Management**: Parts and materials tracking

## 🤝 Support

For technical support or business inquiries:
- **WhatsApp**: +1 (809) 555-0123
- **Email**: info@multiservicios-elseibo.com
- **Location**: El Seibo, República Dominicana

---

**⚡ MultiServicios El Seibo** - Bringing professional electrical services to the Dominican Republic with modern technology and traditional quality. 