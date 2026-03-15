# Facebook Lead Auto Dialer - Alternative Integration Options

## 🔄 Integration Variations

Based on your specific AI voice platform, here are the main integration options:

### **Option 1: Retell AI Integration (Recommended)**
- **File:** `Facebook_Retail_AI_Auto_Dialer_Workflow.json`
- **Best For:** Complete conversational AI with natural voice
- **Features:** Built-in call management, conversation analytics
- **Cost:** Pay per minute of conversation

### **Option 2: ElevenLabs + Twilio Integration**
For direct ElevenLabs integration with Twilio calling:

```javascript
// ElevenLabs API Call Node Configuration
{
  "url": "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer {{ $credentials.elevenlabs_api_key }}",
    "Content-Type": "application/json"
  },
  "body": {
    "text": "Hi {{ $node['Process Lead Data'].json.lead.name }}, this is [Your Business]. I'm calling about your recent inquiry. Do you have a moment?",
    "voice_settings": {
      "stability": 0.75,
      "similarity_boost": 0.75
    }
  }
}
```

### **Option 3: Custom AI Provider Integration**
For other AI providers (OpenAI, Anthropic, etc.), modify the API calls accordingly.

## 🎯 LegacyCore Platform Integration

Since you're working with LegacyCore's AI Pre-Qualifier system, here's how to integrate this workflow:

### **LegacyCore AI Pre-Qualifier Integration:**
```javascript
// Custom API endpoint for LegacyCore
{
  "url": "https://your-legacycore-domain.com/api/ai-pre-qualifier/campaigns",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer {{ $credentials.legacycore_api_key }}",
    "Content-Type": "application/json"
  },
  "body": {
    "lead_id": "{{ $node['Process Lead Data'].json.lead.id }}",
    "phone_number": "{{ $node['Process Lead Data'].json.lead.phone }}",
    "campaign_type": "facebook_lead_followup",
    "metadata": {
      "source": "facebook_lead_ad",
      "name": "{{ $node['Process Lead Data'].json.lead.name }}",
      "email": "{{ $node['Process Lead Data'].json.lead.email }}"
    }
  }
}
```

## 🔧 Advanced Customizations

### **Lead Scoring Integration:**
Add a lead scoring node before calling:

```javascript
// Lead Scoring Logic
const lead = $node['Process Lead Data'].json.lead;
let score = 0;

// Score based on form completion
if (lead.email) score += 20;
if (lead.name) score += 15;
if (lead.phone) score += 25;

// Score based on campaign source
if (lead.campaign_id?.includes('premium')) score += 30;
if (lead.ad_id?.includes('retargeting')) score += 25;

// Time-based scoring
const hoursSinceCreated = (new Date() - new Date(lead.created_time)) / (1000 * 60 * 60);
if (hoursSinceCreated < 1) score += 40; // Hot lead
else if (hoursSinceCreated < 24) score += 20; // Warm lead

lead.score = score;
lead.priority = score > 80 ? 'high' : score > 50 ? 'medium' : 'low';

return { lead };
```

### **Geographic Time Zone Handling:**
```javascript
// Time Zone Aware Business Hours
const lead = $node['Process Lead Data'].json.lead;

// Extract area code or use geo-lookup service
const areaCode = lead.phone.substring(2, 5); // Assuming +1234567890 format
const timeZoneMap = {
  '212': 'America/New_York',
  '213': 'America/Los_Angeles',
  '312': 'America/Chicago'
  // Add more mappings
};

const leadTimeZone = timeZoneMap[areaCode] || 'America/New_York';
const now = new Date().toLocaleString("en-US", {timeZone: leadTimeZone});
const leadLocalTime = new Date(now);
const hour = leadLocalTime.getHours();
const day = leadLocalTime.getDay();

// Check business hours in lead's timezone
const isBusinessHours = (day >= 1 && day <= 5 && hour >= 9 && hour < 20) || 
                       (day === 6 && hour >= 10 && hour < 18);

return { isBusinessHours, leadLocalTime, leadTimeZone };
```

### **CRM Integration:**
```javascript
// Salesforce/HubSpot/Custom CRM Integration
{
  "url": "https://api.salesforce.com/services/data/v52.0/sobjects/Lead/",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer {{ $credentials.salesforce_token }}",
    "Content-Type": "application/json"
  },
  "body": {
    "FirstName": "{{ $node['Process Lead Data'].json.lead.name.split(' ')[0] }}",
    "LastName": "{{ $node['Process Lead Data'].json.lead.name.split(' ').slice(1).join(' ') }}",
    "Phone": "{{ $node['Process Lead Data'].json.lead.phone }}",
    "Email": "{{ $node['Process Lead Data'].json.lead.email }}",
    "LeadSource": "Facebook Lead Ad",
    "Campaign__c": "{{ $node['Process Lead Data'].json.lead.campaign_id }}",
    "Lead_Score__c": "{{ $node['Lead Scoring'].json.lead.score }}"
  }
}
```

## 📊 Analytics and Reporting

### **Enhanced Google Sheets Tracking:**
Add these columns for better analytics:
- Lead Score
- Time Zone
- Call Duration
- Conversation Summary
- Conversion Outcome
- Revenue Attribution
- Follow-up Notes

### **Slack Notifications:**
```javascript
// High-priority lead notifications
{
  "url": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
  "method": "POST",
  "body": {
    "text": "🔥 High Priority Lead Alert!",
    "attachments": [
      {
        "color": "#ff0000",
        "fields": [
          {
            "title": "Name",
            "value": "{{ $node['Process Lead Data'].json.lead.name }}",
            "short": true
          },
          {
            "title": "Score",
            "value": "{{ $node['Lead Scoring'].json.lead.score }}/100",
            "short": true
          },
          {
            "title": "Phone",
            "value": "{{ $node['Process Lead Data'].json.lead.phone }}",
            "short": true
          },
          {
            "title": "Campaign",
            "value": "{{ $node['Process Lead Data'].json.lead.campaign_id }}",
            "short": true
          }
        ]
      }
    ]
  }
}
```

## 🎪 Advanced Features

### **A/B Testing Call Scripts:**
```javascript
// Randomly assign call scripts for testing
const scripts = [
  "Script A: Direct approach",
  "Script B: Question-based approach", 
  "Script C: Value-first approach"
];

const scriptIndex = Math.floor(Math.random() * scripts.length);
const selectedScript = scripts[scriptIndex];

// Pass script to AI agent
return { 
  script: selectedScript,
  script_version: String.fromCharCode(65 + scriptIndex) // A, B, C
};
```

### **Intelligent Call Timing:**
```javascript
// Optimal call time prediction based on lead data
const lead = $node['Process Lead Data'].json.lead;
const createdTime = new Date(lead.created_time);
const currentTime = new Date();

// Calculate optimal call time based on:
// 1. When lead was generated
// 2. Typical response patterns
// 3. Day of week
// 4. Historical success rates

let optimalDelay = 0; // minutes

if (createdTime.getHours() >= 17) {
  // Lead generated after 5 PM, call next morning
  optimalDelay = (24 - createdTime.getHours() + 9) * 60;
} else if (createdTime.getDay() === 6) {
  // Saturday lead, call Monday
  optimalDelay = (48 + 9 - createdTime.getHours()) * 60;
}

return { optimalDelay, suggestedCallTime: new Date(currentTime.getTime() + optimalDelay * 60000) };
```

### **Dynamic Message Personalization:**
```javascript
// Personalize messages based on lead data
const lead = $node['Process Lead Data'].json.lead;
const formId = lead.form_id;

// Different messages based on form type
const messageTemplates = {
  'form_pricing': `Hi ${lead.name}! You requested pricing information. I have some exclusive deals to share with you.`,
  'form_demo': `Hello ${lead.name}! You're interested in a demo. I can walk you through our solutions right now.`,
  'form_contact': `Hi ${lead.name}! Thanks for reaching out. I have answers to your questions.`,
  'default': `Hi ${lead.name}! I'm calling about your recent inquiry. Do you have a moment?`
};

const message = messageTemplates[formId] || messageTemplates['default'];

return { personalizedMessage: message };
```

This comprehensive workflow and documentation package provides everything you need to implement an advanced, automated lead calling system that integrates with your retail AI agent platform!