# SymbioMed Terminology Service - API Integration Summary

## ✅ All Required APIs Successfully Integrated

This document provides a complete overview of all integrated API endpoints in the SymbioMed Terminology Service web application.

---

## 🏥 Health Check API

### Endpoint
```
GET https://symbiomed.onrender.com/health
```

### Location
- **File**: `src/pages/APIPlayground.jsx`
- **Section**: Health Check Card (lines 444-469)

### Description
Checks if the API server is running and healthy.

---

## 📄 Page 1: Unified Search Page

### Component
`src/pages/SearchPage.jsx`

### API Endpoint Used

#### ValueSet $expand
```
GET https://symbiomed.onrender.com/fhir/ValueSet/$expand?url={valuesetUrl}&filter={text}
```

**Hardcoded URL**: `http://sih.gov.in/fhir/ValueSet/namaste-ayurveda`

### Features
- ✅ Single search bar for NAMASTE/Ayurveda terms
- ✅ Displays list of terms (code + display name)
- ✅ Clicking a term navigates to Mapping Page
- ✅ Loading and error states
- ✅ Animated results with GSAP
- ✅ Mobile-friendly design

---

## 📄 Page 2: Mapping Page (NAMASTE → TM2 Mapping Viewer)

### Component
`src/pages/MappingPage.jsx`

### API Endpoints Used

#### 1. CodeSystem $lookup
```
GET https://symbiomed.onrender.com/fhir/CodeSystem/$lookup?system={system}&code={code}
```

**Hardcoded System**: `http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda`

**Purpose**: Fetches detailed information about a specific NAMASTE code

#### 2. ConceptMap $translate
```
GET https://symbiomed.onrender.com/fhir/ConceptMap/$translate?url=urn:conceptmap:NAMASTE_TO_ICD11_TM2_MAPPING&system=urn:namaste&target=http://id.who.int/icd/entity&code={code}
```

**Purpose**: Translates NAMASTE code to ICD-11 TM2 mapping

### Features
- ✅ Displays NAMASTE code details
- ✅ Shows TM2 mapped code(s)
- ✅ Displays mapping equivalence
- ✅ Shows display terms and metadata
- ✅ "Generate FHIR Condition" button → navigates to Page 3
- ✅ "Test in API Playground" button
- ✅ Raw JSON viewer (collapsible)

---

## 📄 Page 3: FHIR Condition Builder (Problem List Entry)

### Component
`src/pages/FHIRBuilder.jsx`

### API Endpoints Used

#### 1. POST Problem List Ingestion
```
POST https://symbiomed.onrender.com/fhir/ingest/problem-list
```

**Payload**:
```json
{
  "ayushCode": "string",
  "ayushSystem": "string",
  "clinicalStatus": "string",
  "verificationStatus": "string",
  "encounterClass": "string",
  "onsetDate": "YYYY-MM-DD"
}
```

**Purpose**: Creates a FHIR Condition resource (Problem List Entry)

#### 2. POST Validate Dual Coding
```
POST https://symbiomed.onrender.com/fhir/validate/dual-code
```

**Payload**:
```json
{
  "ayushCode": "string",
  "ayushSystem": "string"
}
```

**Purpose**: Validates dual coding (AYUSH + ICD-11)

### Features
- ✅ Form with all required fields:
  - AYUSH Code
  - AYUSH System (pre-filled)
  - Clinical Status (dropdown)
  - Verification Status (dropdown)
  - Encounter Class (dropdown)
  - Onset Date (auto-filled with today's date)
- ✅ "Create FHIR Condition" button
- ✅ "Validate Dual Coding" button
- ✅ Displays JSON response from API
- ✅ Visual validation feedback (valid/invalid)
- ✅ Loading states for both operations

---

## 📄 Page 4: API Playground

### Component
`src/pages/APIPlayground.jsx`

### API Endpoints Used

#### 1. CodeSystem $lookup (GET)
```
GET https://symbiomed.onrender.com/fhir/CodeSystem/$lookup?system={system}&code={code}
```

#### 2. ConceptMap $translate (GET)
```
GET https://symbiomed.onrender.com/fhir/ConceptMap/$translate?url=urn:conceptmap:NAMASTE_TO_ICD11_TM2_MAPPING&system=urn:namaste&target=http://id.who.int/icd/entity&code={code}
```

#### 3. ValueSet $validate-code (GET)
```
GET https://symbiomed.onrender.com/fhir/ValueSet/$validate-code?url={valuesetUrl}&system={system}&code={code}
```

#### 4. ValueSet $validate-code (POST)
```
POST https://symbiomed.onrender.com/fhir/ValueSet/$validate-code
```

**Payload**:
```json
{
  "url": "string",
  "system": "string",
  "code": "string"
}
```

#### 5. Get Bundle (GET)
```
GET https://symbiomed.onrender.com/fhir/bundle
```

#### 6. Upload Bundle (POST)
```
POST https://symbiomed.onrender.com/fhir/bundle/upload
```

**Payload**: FHIR Bundle JSON

### Features
- ✅ 4 tabs: $lookup, $translate, $validate-code, Bundle
- ✅ Clear input forms for each operation
- ✅ JSON output viewer
- ✅ Loading and error states
- ✅ Pre-filled default values
- ✅ Both GET and POST methods for $validate-code
- ✅ Bundle retrieval and upload functionality
- ✅ Health check button

---

## 🎨 UI/UX Features

### Design
- ✅ Clean, modern UI with Tailwind CSS
- ✅ Glassmorphism effects
- ✅ Gradient buttons and text
- ✅ Big fonts for readability (judges-friendly)
- ✅ Mobile-friendly responsive design
- ✅ Custom scrollbars

### Reusable Components
- ✅ `ApiCard` - Consistent card design
- ✅ `Loading` - Loading spinner with message
- ✅ `ErrorMessage` - Error display with retry option
- ✅ `Layout` - Navbar and footer wrapper

### User Experience
- ✅ GSAP animations for smooth page transitions
- ✅ Hover effects and micro-animations
- ✅ Loading states for all API calls
- ✅ Error handling with user-friendly messages
- ✅ Clear explanations for each operation
- ✅ Feels like a terminology explorer, not a technical tool

### Branding
- ✅ Custom logo (from uploaded image)
- ✅ Custom favicon
- ✅ "SYMBIOMED" branding (uppercase)
- ✅ Consistent color scheme (blue gradients)

---

## 🛣️ Routing Structure

```javascript
/ → SearchPage (Unified Search)
/mapping/:code → MappingPage (NAMASTE → TM2 Mapping Viewer)
/fhir-builder → FHIRBuilder (FHIR Condition Builder)
/api-playground → APIPlayground (API Playground)
```

---

## 📊 API Endpoints Coverage

| Endpoint | Method | Page(s) Used | Status |
|----------|--------|--------------|--------|
| `/health` | GET | API Playground | ✅ Integrated |
| `/fhir/CodeSystem/$lookup` | GET | Mapping Page, API Playground | ✅ Integrated |
| `/fhir/ValueSet/$expand` | GET | Search Page | ✅ Integrated |
| `/fhir/ConceptMap/$translate` | GET | Mapping Page, API Playground | ✅ Integrated |
| `/fhir/ValueSet/$validate-code` | GET | API Playground | ✅ Integrated |
| `/fhir/ValueSet/$validate-code` | POST | API Playground | ✅ Integrated |
| `/fhir/ingest/problem-list` | POST | FHIR Builder | ✅ Integrated |
| `/fhir/validate/dual-code` | POST | FHIR Builder | ✅ Integrated |
| `/fhir/bundle` | GET | API Playground | ✅ Integrated |
| `/fhir/bundle/upload` | POST | API Playground | ✅ Integrated |

**Total: 10/10 endpoints integrated** ✅

---

## 🔧 Technical Details

### Tech Stack
- **Framework**: React 18+ with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: GSAP
- **HTTP Client**: Native fetch() API

### Configuration
- All API URLs are hardcoded (no config files needed)
- Pure client-side application (no backend required)
- No authentication needed

### Running the Application
```bash
npm install
npm run dev
```

---

## ✨ Recent Updates

1. ✅ Removed "SIH 2024" badge from navbar
2. ✅ Fixed button text visibility in API Playground tabs
3. ✅ Updated logo and favicon with custom image
4. ✅ Changed "SymbioMed" to "SYMBIOMED" (uppercase)
5. ✅ Fixed color scheme (replaced non-existent 'primary' colors with 'blue')

---

## 📝 Notes for Judges

This application demonstrates:

1. **FHIR Terminology Services**: Full implementation of FHIR terminology operations ($lookup, $expand, $translate, $validate-code)

2. **Interoperability**: Bridges traditional AYUSH terminology (NAMASTE) with international standards (ICD-11 TM2)

3. **User-Friendly Design**: Non-technical users can easily search, explore, and understand medical terminology mappings

4. **FHIR Resource Creation**: Ability to create standard FHIR Condition resources with dual coding

5. **Validation**: Built-in validation for dual coding to ensure data quality

6. **Complete API Coverage**: All required endpoints are functional and accessible through the UI

---

**Last Updated**: December 5, 2025  
**Status**: ✅ All APIs Integrated and Tested  
**Application URL**: http://localhost:5173 (dev server)
