# Facebook Retail AI Auto Dialer - Complete Setup Guide

## 🎯 Workflow Overview

This n8n workflow automatically triggers your Retell AI voice agent to call new Facebook leads with intelligent retry mechanisms and multi-channel follow-up sequences.

### **Key Features:**
- ✅ **Facebook Lead Form Integration** - Instant trigger on new leads
- ✅ **Retell AI Voice Agent** - Automated outbound calling 
- ✅ **Smart Retry Logic** - 3 attempts with escalating delays
- ✅ **Business Hours Compliance** - Respects calling time restrictions
- ✅ **Multi-Channel Follow-up** - SMS and email sequences
- ✅ **Google Sheets Logging** - Complete lead tracking
- ✅ **TCPA Compliance** - Opt-out mechanisms included

## 🔧 Required Credentials Setup

### 1. **Retell AI Configuration**
```bash
# Create Retell AI credential in n8n
Name: retell_api_key
Type: Generic Credential (HTTP Header Auth)
Header Name: Authorization
Header Value: Bearer YOUR_RETELL_API_KEY
```

### 2. **Twilio SMS/Phone Configuration**
```bash
# Twilio credentials needed:
twilio_account_sid: Your Twilio Account SID
twilio_auth_token: Your Twilio Auth Token  
twilio_phone_number: Your Twilio phone number (+1234567890)
```

### 3. **Email Service Setup**
```bash
# Email credentials (choose one):
business_email: your-business@domain.com
# Configure SMTP, Gmail, or other email service in n8n
```

### 4. **Google Sheets Integration**
```bash
# Google Sheets for lead tracking:
google_sheets_lead_tracking_id: Your Google Sheet ID
# Sheet must have columns: Lead ID, Name, Phone, Email, Source, Campaign ID, Created Time, Call Attempts, Last Call Status, Status, Next Action
```

### 5. **Business Contact Information**
```bash
# Business info for messages:
business_phone: Your business phone number for callbacks
business_email: Your business email for inquiries
```

## 📋 Facebook Lead Form Setup

### **Webhook Configuration:**
1. **Copy the webhook URL** from the first node: `Facebook Lead Webhook`
2. **Configure Facebook Lead Ads** to send data to this webhook
3. **Required Facebook fields** to capture:
   - Full Name (field name: `full_name` or `name`)
   - Phone Number (field name: `phone_number` or `phone`)
   - Email Address (field name: `email`)

### **Facebook Webhook Test Data:**
```json
{
  "leadgen_id": "123456789",
  "form_id": "form_123",
  "ad_id": "ad_456", 
  "campaign_id": "camp_789",
  "created_time": "2025-01-27T10:00:00Z",
  "field_data": [
    {
      "name": "full_name",
      "values": ["John Doe"]
    },
    {
      "name": "phone_number", 
      "values": ["+1234567890"]
    },
    {
      "name": "email",
      "values": ["john@example.com"]
    }
  ]
}
```

## 🎭 Retell AI Agent Configuration

### **Required Agent Setup:**
```javascript
// Create your Retell AI agent with these settings:
{
  "agent_name": "Retail Sales Assistant",
  "voice_id": "your-chosen-voice-id",
  "language": "en-US",
  "response_engine": "eleven_labs", // or your preference
  "begin_message": "Hi! This is [Your Business Name]. I'm calling about your recent inquiry. Do you have a moment to chat about our special offers?",
  "general_prompt": "You are a friendly retail sales assistant. Your goal is to qualify leads and book appointments. Be conversational, helpful, and respectful of the customer's time.",
  "general_tools": [
    "appointment_booking",
    "product_information", 
    "pricing_details"
  ]
}
```

### **Sales Script Guidelines:**
- Keep initial greeting under 15 seconds
- Ask permission to continue the call
- Focus on value proposition quickly
- Offer specific next steps (callback, appointment, visit)
- Handle objections professionally
- Always provide opt-out option

## ⏰ Workflow Timing Logic

### **Call Retry Schedule:**
- **Attempt 1:** Immediate (during business hours)
- **Attempt 2:** 1 hour later (if no answer)  
- **Attempt 3:** 3 hours after attempt 2 (if no answer)
- **Max Attempts:** 3 calls total

### **Business Hours:** 
- **Monday-Friday:** 9 AM - 8 PM
- **Saturday:** 10 AM - 6 PM  
- **Sunday:** No calls (compliance)
- **Time Zone:** Uses server/local time (modify as needed)

### **Follow-up Sequence:**
- **SMS 1:** Immediate after max call attempts
- **Email:** Immediate after SMS 1
- **Wait:** 24 hours
- **SMS 2:** Final reminder with urgency

## 📊 Lead Tracking & Analytics

### **Google Sheets Integration:**
Creates comprehensive lead tracking with columns:
- Lead ID, Name, Phone, Email
- Source (facebook_lead_ad)
- Campaign ID, Ad ID, Form ID
- Created Time, Call Attempts
- Last Call Status, Overall Status
- Next Action

### **Status Types:**
- `new` - Fresh lead, first call pending
- `calling` - Currently in call process
- `contacted` - Successfully reached customer
- `retry_pending` - Waiting for next retry attempt
- `max_attempts_reached` - Moved to SMS/email sequence
- `converted` - Lead became customer
- `unqualified` - Not interested/qualified

## 🔄 Workflow Node Details

### **1. Facebook Lead Webhook**
- **Purpose:** Receives new lead data from Facebook
- **Path:** `/facebook-lead`
- **Method:** POST
- **Authentication:** None (public webhook)

### **2. Process Lead Data**
- **Purpose:** Extracts and validates lead information
- **Logic:** Parses Facebook field_data array
- **Validation:** Ensures phone number exists
- **Output:** Cleaned and structured lead object

### **3. Business Hours Check**
- **Purpose:** Ensures calls only during appropriate times
- **Logic:** Checks current day/time against business hours
- **True Path:** Proceed with immediate call
- **False Path:** Wait until business hours

### **4. Initiate AI Call (Retell)**
- **Purpose:** Starts Retell AI voice call
- **API:** `POST https://api.retellai.com/create-call`
- **Data:** Agent ID, phone numbers, metadata
- **Output:** Call ID for status tracking

### **5. Wait for Call Completion**
- **Purpose:** Allows time for call to complete
- **Duration:** 5 minutes (adjust based on typical call length)
- **Logic:** Prevents premature status checking

### **6. Check Call Status**
- **Purpose:** Retrieves call completion data
- **API:** `GET https://api.retellai.com/get-call/{call_id}`
- **Data:** Call status, duration, success metrics

### **7. Call Success Check**
- **Purpose:** Determines if call was successful
- **Criteria:** Status = "completed" AND answered = true
- **Success:** Log and end workflow
- **Failure:** Proceed to retry logic

### **8. Update Retry Logic**
- **Purpose:** Manages retry attempt counter and timing
- **Logic:** Increments attempts, sets next action time
- **Retry Delays:** 1 hour for attempt 2, 3 hours for attempt 3
- **Max Attempts:** 3 total calls

### **9. Multi-Channel Follow-up**
- **SMS Messages:** Professional, branded, with opt-out
- **Email Template:** HTML formatted with call-to-action buttons
- **Final Reminder:** Urgency-based messaging after 24 hours

## 🎨 Customization Options

### **Modify Business Hours:**
```javascript
// In Business Hours Check node, update this logic:
const now = new Date();
const hour = now.getHours();
const day = now.getDay();

// Custom hours example: 8 AM - 9 PM weekdays, 10 AM - 5 PM weekends
if (day === 0) return false; // No Sunday calls
if (day === 6) return hour >= 10 && hour < 17; // Saturday 10-5
return hour >= 8 && hour < 21; // Weekdays 8-9
```

### **Adjust Retry Timing:**
```javascript
// In Update Retry Logic node, modify wait times:
const hoursToWait = updatedLead.call_attempts === 1 ? 2 : 6; // 2 hours, then 6 hours
// Or set specific times:
const waitTimes = [0, 1.5, 4]; // 0, 1.5 hours, 4 hours
```

### **Customize SMS Messages:**
```javascript
// Professional tone:
"Hi {{ name }}, we tried calling about your inquiry. Please call {{ business_phone }} at your convenience."

// Urgent tone:
"{{ name }}, limited-time offer expires soon! Call {{ business_phone }} now to secure your discount."

// Casual tone:
"Hey {{ name }}! Missed your call. Let's chat about those deals. Call us at {{ business_phone }}!"
```

### **Modify Email Template:**
- Update company branding and colors
- Add specific product offers
- Include customer testimonials
- Customize call-to-action buttons
- Add unsubscribe links (required)

## 🛡️ Compliance & Best Practices

### **TCPA Compliance:**
- ✅ Only call leads who submitted forms (express consent)
- ✅ Respect business hours and time zones
- ✅ Provide clear opt-out mechanisms in all messages
- ✅ Maintain Do Not Call list integration (add as needed)
- ✅ Record consent timestamps and sources

### **Data Protection:**
- ✅ Secure credential storage in n8n
- ✅ Limited data retention in Google Sheets
- ✅ No sensitive data in workflow logs
- ✅ GDPR-compliant unsubscribe process

### **Quality Assurance:**
- ✅ Monitor call success rates and adjust timing
- ✅ A/B test different messaging approaches
- ✅ Track conversion rates by campaign
- ✅ Regular Retell AI agent performance review

## 🚀 Deployment Steps

### **1. Import Workflow:**
```bash
1. Download Facebook_Retail_AI_Auto_Dialer_Workflow.json
2. Open n8n interface
3. Click "Import from File"
4. Select the downloaded JSON file
5. Activate the workflow
```

### **2. Configure Credentials:**
```bash
1. Go to n8n Settings > Credentials
2. Add all required credentials listed above
3. Test each credential connection
4. Update credential references in workflow nodes
```

### **3. Set Up Integrations:**
```bash
1. Create Google Sheet with required columns
2. Configure Retell AI agent with your script
3. Set up Facebook Lead Form webhook
4. Configure Twilio phone number
5. Test email service connection
```

### **4. Testing:**
```bash
1. Send test webhook from Facebook or manually
2. Monitor workflow execution in n8n
3. Verify call initiation in Retell AI dashboard
4. Check SMS/email delivery
5. Confirm Google Sheets logging
```

### **5. Monitoring:**
```bash
1. Set up n8n workflow alerts
2. Monitor Retell AI usage and costs
3. Track conversion rates in Google Sheets
4. Review customer feedback and adjust scripts
5. Optimize retry timing based on success rates
```

## 📈 Performance Optimization

### **Expected Metrics:**
- **Call Answer Rate:** 25-40% (industry average)
- **Conversion Rate:** 5-15% of answered calls
- **Cost per Lead:** $20-50 depending on industry
- **ROI:** 3-10x with proper optimization

### **Optimization Tips:**
1. **A/B Test Call Times:** Find optimal hours for your audience
2. **Script Refinement:** Improve based on call recordings
3. **Lead Scoring:** Prioritize higher-quality leads
4. **Geographic Targeting:** Adjust for time zones
5. **Seasonal Adjustments:** Modify approach for holidays/events

## 🔧 Troubleshooting

### **Common Issues:**

**Webhook Not Triggering:**
- Verify Facebook webhook configuration
- Check n8n webhook URL accessibility
- Test with manual HTTP requests

**Retell AI Calls Failing:**
- Verify API credentials and agent ID
- Check phone number formatting (+1234567890)
- Review Retell AI account limits/billing

**SMS/Email Not Sending:**
- Confirm Twilio account setup and phone number
- Verify email service credentials
- Check for spam filtering/delivery issues

**Google Sheets Not Updating:**
- Verify Google Sheets API permissions
- Check sheet ID and column names
- Ensure proper authentication scopes

### **Debug Mode:**
Enable n8n debug mode to see detailed execution logs and identify issues at each step.

## 📞 Support & Resources

### **Documentation Links:**
- [Retell AI API Docs](https://docs.retellai.com/)
- [n8n Documentation](https://docs.n8n.io/)
- [Facebook Lead Ads Webhooks](https://developers.facebook.com/docs/marketing-api/webhooks/)
- [Twilio SMS API](https://www.twilio.com/docs/sms)

### **Best Practices:**
- Start with small test campaigns
- Monitor compliance closely
- Gather customer feedback
- Continuously optimize scripts
- Track ROI metrics carefully

This workflow provides a complete automated lead calling solution that can significantly improve your conversion rates while maintaining compliance and providing excellent customer experience.