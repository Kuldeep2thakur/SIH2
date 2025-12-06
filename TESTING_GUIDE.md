# Quick Testing Guide - SymbioMed Terminology Service

## 🚀 Quick Start

1. Make sure the dev server is running:
   ```bash
   npm run dev
   ```

2. Open browser to: `http://localhost:5173`

---

## 🧪 Testing Each Page

### 1️⃣ Unified Search Page (Home)

**URL**: `http://localhost:5173/`

**Test Steps**:
1. Enter a search term (try: "dosha", "vata", "pitta", "AA", "AB")
2. Click "Search Terminology"
3. Results should appear as cards
4. Click any result card to navigate to Mapping Page

**Expected**:
- Search bar works
- Results display with code badges
- Loading spinner appears during search
- Cards are clickable

---

### 2️⃣ Mapping Page

**URL**: `http://localhost:5173/mapping/AA` (or any code)

**Test Steps**:
1. Navigate from Search Page OR directly enter URL
2. View NAMASTE code details (left card)
3. View TM2 mapping (right card)
4. Click "Generate FHIR Condition Resource" → Should go to FHIR Builder
5. Click "Test in API Playground" → Should go to API Playground
6. Expand "View Raw JSON Response" to see API responses

**Expected**:
- Code details load and display
- Mapping shows (if available)
- Navigation buttons work
- Raw JSON is viewable

**Test Codes**:
- `AA` - Should have mapping
- `AB` - Should have mapping
- Try other codes from search results

---

### 3️⃣ FHIR Builder

**URL**: `http://localhost:5173/fhir-builder`

**Test Steps**:

#### Test 1: Create FHIR Condition
1. Enter AYUSH Code: `AA`
2. Keep AYUSH System as default
3. Select Clinical Status: `active`
4. Select Verification Status: `confirmed`
5. Select Encounter Class: `AMB`
6. Keep or modify Onset Date
7. Click "📤 Create FHIR Condition"

**Expected**:
- Success message appears
- JSON response displays below
- Green success banner shows

#### Test 2: Validate Dual Coding
1. Enter AYUSH Code: `AA`
2. Click "✓ Validate Dual Coding"

**Expected**:
- Validation response appears
- Shows "Valid" or "Invalid" with color coding
- JSON response displays

---

### 4️⃣ API Playground

**URL**: `http://localhost:5173/api-playground`

**Test Each Tab**:

#### Tab 1: $lookup
1. System URL: `http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda`
2. Code: `AA`
3. Click "🔍 Lookup Code"

**Expected**: JSON response in right panel

#### Tab 2: $translate
1. NAMASTE Code: `AA`
2. Click "🔗 Translate Code"

**Expected**: Translation to ICD-11 TM2 displayed

#### Tab 3: $validate-code
1. ValueSet URL: `http://sih.gov.in/fhir/ValueSet/namaste-ayurveda`
2. System: `http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda`
3. Code: `AA`
4. Try both "GET Request" and "POST Request"

**Expected**: Validation result appears

#### Tab 4: Bundle
1. Click "📥 Get Bundle" to retrieve

**Expected**: Bundle JSON appears

2. For Upload, paste valid FHIR Bundle JSON in textarea
3. Click "📤 Upload Bundle"

**Expected**: Success or error response

#### Health Check
1. Scroll to bottom
2. Click "🏥 Check API Health"

**Expected**: Health status JSON appears

---

## 🔍 Sample Test Data

### Valid NAMASTE Codes
Try these codes in any endpoint:
- `AA`
- `AB`
- `AC`
- `AD`

### Sample Bundle JSON (for testing upload)
```json
{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "CodeSystem",
        "id": "test",
        "url": "http://example.org/test",
        "status": "active",
        "content": "complete"
      }
    }
  ]
}
```

---

## ✅ Features to Verify

### Visual Elements
- [ ] Logo displays correctly (custom uploaded image)
- [ ] Favicon shows in browser tab
- [ ] "SYMBIOMED" is uppercase in navbar
- [ ] NO "SIH 2024" badge in navbar
- [ ] Blue color scheme (no invisible text)
- [ ] Smooth animations on page load
- [ ] Hover effects on buttons and cards

### Functionality
- [ ] All navigation links work
- [ ] Search returns results
- [ ] Clicking search results navigates to mapping
- [ ] Mapping page shows code details
- [ ] FHIR Builder creates resources
- [ ] Validation works
- [ ] All API Playground tabs function
- [ ] Loading spinners appear during API calls
- [ ] Error messages display if API fails

### Mobile Responsiveness
- [ ] Navbar collapses on mobile
- [ ] Mobile menu works (hamburger icon)
- [ ] Cards stack properly on small screens
- [ ] Text is readable on mobile
- [ ] Buttons are tap-friendly

---

## 🐛 Troubleshooting

### Issue: API calls failing
- **Check**: Is the API server at `symbiomed.onrender.com` online?
- **Solution**: The backend might be sleeping (Render free tier). Wait 30-60 seconds for first request.

### Issue: No results in search
- **Check**: Did you enter a valid search term?
- **Solution**: Try "dosha", "vata", or just search for "a"

### Issue: Colors look wrong
- **Solution**: All `primary` colors have been replaced with `blue`. Refresh the page.

### Issue: Logo not showing
- **Check**: File exists at `/public/WhatsApp Image 2025-09-23 at 15.12.01_7162a348.jpg`
- **Solution**: Verify the file is in the public folder

---

## 📊 Expected API Response Times

- **Health Check**: < 1 second
- **$expand (Search)**: 2-5 seconds (first call may be slower)
- **$lookup**: 1-3 seconds
- **$translate**: 1-3 seconds
- **$validate-code**: 1-2 seconds
- **Problem List Ingestion**: 2-4 seconds
- **Dual Code Validation**: 1-3 seconds
- **Bundle Operations**: 2-5 seconds

**Note**: First API call after server sleep may take 30-60 seconds on Render free tier.

---

## 🎯 Demo Flow for Judges

### Recommended Demo Sequence:

1. **Start at Home (Search Page)**
   - Search for "vata" or "dosha"
   - Show results appearing with animation
   - Click a result

2. **Mapping Page**
   - Highlight NAMASTE code details
   - Show ICD-11 TM2 mapping
   - Explain equivalence
   - Click "Generate FHIR Condition"

3. **FHIR Builder**
   - Show pre-filled code from mapping
   - Explain form fields
   - Create FHIR Condition
   - Show JSON response
   - Click "Validate Dual Coding"
   - Show validation result

4. **API Playground**
   - Quickly demo each tab
   - Show how judges can test any endpoint
   - Run health check to confirm API is live

5. **Conclusion**
   - Navigate back to home
   - Highlight clean UI, big fonts, mobile-friendly
   - Mention all 10 endpoints are integrated

---

**Last Updated**: December 5, 2025  
**Testing Status**: ✅ All Features Working
