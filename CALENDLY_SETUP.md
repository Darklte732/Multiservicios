# 🗓️ Calendly Integration Setup Guide

## Overview
Your MultiServicios app now integrates with Calendly for professional appointment scheduling. This guide will help you set up your Calendly account and configure the event types.

## 🚀 Step 1: Create Calendly Account

1. **Sign up for Calendly**: Go to [calendly.com](https://calendly.com)
2. **Choose a plan**: 
   - **Basic Plan (Free)**: Perfect for getting started
   - **Essentials Plan ($8/month)**: Recommended for business use
   - **Professional Plan ($12/month)**: Advanced features

3. **Set your username**: Use `multiservicos-el-seibo` (this matches the URLs in your app)

## ⚙️ Step 2: Configure Event Types

Create these 4 event types to match your services:

### 1. Emergencia Eléctrica
- **URL**: `/emergencia-electrica`
- **Duration**: 60 minutes
- **Description**: "Servicio de emergencia eléctrica 24/7 para problemas urgentes"
- **Availability**: 24/7 (or your emergency hours)
- **Buffer time**: 15 minutes
- **Color**: Red (#dc2626)

### 2. Reparación Eléctrica  
- **URL**: `/reparacion-electrica`
- **Duration**: 90 minutes
- **Description**: "Reparación de problemas eléctricos, cortocircuitos y equipos dañados"
- **Availability**: 8:00 AM - 6:00 PM
- **Buffer time**: 30 minutes
- **Color**: Blue (#2563eb)

### 3. Instalación Eléctrica
- **URL**: `/instalacion-electrica`
- **Duration**: 120 minutes
- **Description**: "Instalación de nuevos sistemas eléctricos, tomas e interruptores"
- **Availability**: 8:00 AM - 6:00 PM
- **Buffer time**: 30 minutes
- **Color**: Green (#16a34a)

### 4. Mantenimiento Eléctrico
- **URL**: `/mantenimiento-electrico`
- **Duration**: 60 minutes
- **Description**: "Inspección y mantenimiento preventivo de sistemas eléctricos"
- **Availability**: 8:00 AM - 6:00 PM
- **Buffer time**: 15 minutes
- **Color**: Purple (#9333ea)

## 📝 Step 3: Customize Booking Forms

For each event type, add these custom questions:

1. **Ubicación del Servicio** (Required)
   - Type: Single line text
   - Placeholder: "Calle Principal #123, El Seibo"

2. **Descripción del Problema** (Required)
   - Type: Multi-line text
   - Placeholder: "Describe detalladamente el problema eléctrico..."

3. **Tipo de Propiedad**
   - Type: Multiple choice
   - Options: Casa, Apartamento, Negocio, Oficina

4. **Contacto de Emergencia** (For emergency service only)
   - Type: Phone number
   - Placeholder: "Número alternativo de contacto"

## 🎨 Step 4: Branding & Appearance

1. **Profile Setup**:
   - Business name: "MultiServicios El Seibo"
   - Logo: Upload your ⚡ logo
   - Description: "Servicios eléctricos profesionales en El Seibo"

2. **Appearance**:
   - Primary color: `#0066cc` (Blue)
   - Text color: `#4d4d4d` (Dark gray)
   - Button style: Rounded

3. **Notifications**:
   - Enable email confirmations
   - Enable SMS reminders (if available in DR)
   - Set reminder times: 2 hours and 30 minutes before

## 📲 Step 5: WhatsApp Integration

1. **Notification Templates**:
   ```
   🔌 MultiServicios El Seibo

   ¡Hola [INVITEE_NAME]!

   Tu cita de [EVENT_TYPE] está confirmada:
   📅 [EVENT_DATE] a las [EVENT_TIME]
   📍 [CUSTOM_LOCATION]

   Nuestro técnico llegará puntual.
   
   Para emergencias: +1 809 555-0123
   ```

2. **Setup Zapier Integration** (Optional):
   - Connect Calendly → WhatsApp Business
   - Send automatic confirmations
   - Send reminder messages

## 🔗 Step 6: Test Integration

1. **Update URLs**: If your Calendly username is different, update the URLs in:
   - `src/components/CalendlyEmbed.tsx` (lines 21-40)

2. **Test Each Service**:
   - Go to your app: `localhost:3001`
   - Select each service type
   - Verify Calendly loads correctly
   - Complete a test booking

## 💡 Pro Tips

### For Better Conversions:
- Use clear, benefit-focused descriptions
- Include pricing estimates in descriptions
- Set appropriate buffer times between appointments
- Enable automatic timezone detection

### For Dominican Market:
- Use 12-hour time format
- Include local phone number format validation
- Consider siesta time (12-2 PM) in scheduling
- Offer both Spanish and basic English options

### For Emergency Services:
- Set shorter booking windows (30 minutes minimum)
- Enable instant booking
- Include emergency contact information
- Consider priority scheduling

## 📊 Step 7: Analytics & Optimization

1. **Monitor Metrics**:
   - Booking conversion rates by service type
   - Most popular time slots
   - Cancellation rates
   - Customer feedback

2. **Optimize Based on Data**:
   - Adjust availability windows
   - Modify service descriptions
   - Update pricing information
   - Refine custom questions

## 🔒 Step 8: Security & Privacy

1. **Data Protection**:
   - Enable GDPR compliance features
   - Set data retention policies
   - Configure privacy settings

2. **Spam Protection**:
   - Enable reCAPTCHA
   - Set booking limits
   - Configure approval requirements for new customers

## 🚨 Troubleshooting

### Common Issues:

1. **Calendly not loading**:
   - Check internet connection
   - Verify URL matches your Calendly username
   - Clear browser cache

2. **Wrong timezone**:
   - Ensure Calendly timezone matches Dominican Republic (GMT-4)
   - Test with different devices

3. **Mobile display issues**:
   - Calendly is responsive by default
   - Test on different screen sizes
   - Adjust iframe height if needed

## 🎯 Success Metrics

Track these KPIs to measure success:
- **Booking Rate**: Target >15% of website visitors
- **Show Rate**: Target >85% of bookings
- **Customer Satisfaction**: Target >4.5/5 stars
- **Response Time**: Emergency <2 hours, others <4 hours

## 📞 Support

- **Calendly Support**: [help.calendly.com](https://help.calendly.com)
- **Integration Issues**: Check browser console for errors
- **Custom Development**: Contact your development team

---

¡Éxito con tu nuevo sistema de citas profesional! 🚀⚡ 