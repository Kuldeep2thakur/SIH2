# How to Check API Endpoints - Step by Step Guide

## 🎯 3 Ways to Test Endpoints

---

## ✅ Method 1: Using Your Web Application (EASIEST)

### Your app is already running at: http://localhost:5173

### Test Each Page:

#### 1️⃣ Test Search Endpoint ($expand)
1. Open browser: `http://localhost:5173/`
2. Type in search box: `vata`
3. Click "Search Terminology"
4. ✅ If you see results → endpoint is working!

**Endpoint tested**: `GET /fhir/ValueSet/$expand`

---

#### 2️⃣ Test Lookup & Translate Endpoints
1. From search results, click any code card (e.g., "AA")
2. You'll go to: `http://localhost:5173/mapping/AA`
3. ✅ If you see code details on left → $lookup works
4. ✅ If you see mapping on right → $translate works

**Endpoints tested**: 
- `GET /fhir/CodeSystem/$lookup`
- `GET /fhir/ConceptMap/$translate`

---

#### 3️⃣ Test FHIR Builder Endpoints
1. Go to: `http://localhost:5173/fhir-builder`
2. Enter code: `AA`
3. Click "Create FHIR Condition"
4. ✅ If you see JSON response → ingest/problem-list works
5. Click "Validate Dual Coding"
6. ✅ If you see validation result → validate/dual-code works

**Endpoints tested**:
- `POST /fhir/ingest/problem-list`
- `POST /fhir/validate/dual-code`

---

#### 4️⃣ Test API Playground
1. Go to: `http://localhost:5173/api-playground`
2. Click each tab and test:
   - **$lookup tab**: Enter code `AA`, click "Lookup Code"
   - **$translate tab**: Enter code `AA`, click "Translate Code"
   - **$validate-code tab**: Enter code `AA`, click "GET Request"
   - **Bundle tab**: Click "Get Bundle"
3. Scroll down, click "Check API Health"

**All 10 endpoints tested!**

---

## ✅ Method 2: Using Postman (FOR DETAILED TESTING)

### Step-by-Step Postman Setup:

#### Step 1: Import Collection
1. Open Postman application
2. Click **"Import"** button (top left corner)
3. Click **"Upload Files"**
4. Browse to: `C:\Users\alok\OneDrive\Desktop\symbiomed1\`
5. Select: `SymbioMed-Postman-Collection.json`
6. Click **"Import"**

#### Step 2: Test First Endpoint (Health Check)
1. In left sidebar, you'll see: **"SymbioMed Terminology Service - SIH 2024"**
2. Expand the collection (click the arrow)
3. Click on: **"1. Health Check"**
4. Click the blue **"Send"** button
5. Wait for response (may take 30-60 seconds first time)
6. ✅ Look for **Status: 200 OK** in response

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

#### Step 3: Test CodeSystem $lookup
1. Click on: **"2. CodeSystem $lookup"**
2. Notice the URL has `code=AA` parameter
3. Click **"Send"**
4. ✅ Status should be **200 OK**

**Expected Response:**
```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "display",
      "valueString": "..."
    }
  ]
}
```

#### Step 4: Test All Other Endpoints
Repeat for each endpoint in the collection:
- 3. ValueSet $expand
- 4. ConceptMap $translate
- 5. ValueSet $validate-code (GET)
- 6. ValueSet $validate-code (POST)
- 7. Ingest Problem List
- 8. Validate Dual Code
- 9. Get Bundle
- 10. Upload Bundle

---

## ✅ Method 3: Using Browser DevTools (QUICK CHECK)

### Step 1: Open Your App
1. Open browser: `http://localhost:5173/`

### Step 2: Open DevTools
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I`
- **Firefox**: Press `F12`

### Step 3: Go to Network Tab
1. Click **"Network"** tab in DevTools
2. Make sure **"Fetch/XHR"** filter is selected

### Step 4: Test an Action
1. In your app, type `vata` in search box
2. Click "Search Terminology"
3. Watch the Network tab

### Step 5: Check the Request
1. You'll see a new entry appear: `$expand?url=...`
2. Click on it
3. Check the **Status** column: Should be **200**
4. Click **"Response"** tab to see the data
5. ✅ If you see JSON data → endpoint works!

**What to look for:**
- ✅ Green status (200, 201)
- ✅ JSON response in Preview/Response tab
- ❌ Red status (400, 500) = error

---

## 🔍 Quick Endpoint Status Check

### Using Command Line (Windows PowerShell)

Open PowerShell and run:

```powershell
# Test Health Check
Invoke-RestMethod -Uri "https://symbiomed.onrender.com/health"
```

**Expected output:**
```
status  : ok
message : Server is running
```

### Test Other Endpoints:

```powershell
# Test $lookup
Invoke-RestMethod -Uri "https://symbiomed.onrender.com/fhir/CodeSystem/`$lookup?system=http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda&code=AA"

# Test $expand
Invoke-RestMethod -Uri "https://symbiomed.onrender.com/fhir/ValueSet/`$expand?url=http://sih.gov.in/fhir/ValueSet/namaste-ayurveda&filter=vata"
```

---

## 📊 How to Verify Endpoints are Working

### ✅ Success Indicators:

| Method | What to Look For |
|--------|------------------|
| **Web App** | Data displays, no error messages |
| **Postman** | Status 200/201, JSON response visible |
| **DevTools** | Green status in Network tab, JSON in response |
| **PowerShell** | Data prints to console, no errors |

### ❌ Failure Indicators:

| Issue | Cause | Solution |
|-------|-------|----------|
| Status 404 | Wrong URL | Check spelling of endpoint |
| Status 500 | Server error | Check server logs, wait and retry |
| Timeout | Server sleeping | Wait 60 seconds, retry |
| CORS error | Browser restriction | Use Postman or fix CORS headers |
| Empty response | No data found | Try different search term/code |

---

## 🎯 Recommended Testing Order

### For First Time Testing:

1. **Health Check** - Verify server is alive
   ```
   GET /health
   ```

2. **$expand** - Search for terms
   ```
   GET /fhir/ValueSet/$expand?url=...&filter=vata
   ```

3. **$lookup** - Get code details (use code from step 2)
   ```
   GET /fhir/CodeSystem/$lookup?system=...&code=AA
   ```

4. **$translate** - Get mapping (use same code)
   ```
   GET /fhir/ConceptMap/$translate?...&code=AA
   ```

5. **$validate-code** - Validate the code
   ```
   GET /fhir/ValueSet/$validate-code?...&code=AA
   ```

6. **Ingest Problem List** - Create FHIR resource
   ```
   POST /fhir/ingest/problem-list
   ```

7. **Validate Dual Code** - Validate coding
   ```
   POST /fhir/validate/dual-code
   ```

8. **Bundle Operations** - Get/Upload bundles
   ```
   GET /fhir/bundle
   POST /fhir/bundle/upload
   ```

---

## 💡 Pro Tips

### Tip 1: Check Server Status First
Always start with the health check endpoint to make sure the server is awake.

### Tip 2: First Request is Slow
The server is on Render free tier. First request after inactivity takes 30-60 seconds. Be patient!

### Tip 3: Save Test Data
When you get a good response, save the code/term for future testing.

### Tip 4: Use Valid Codes
Known working codes: `AA`, `AB`, `AC`, `AD`

### Tip 5: Check Response Format
All FHIR responses should have a `resourceType` field.

---

## 🆘 Troubleshooting

### Problem: "Cannot reach server"
**Solution**: 
- Check internet connection
- Verify URL: `https://symbiomed.onrender.com`
- Wait 60 seconds for server to wake up

### Problem: "No results found"
**Solution**:
- Try different search term
- Use known codes: `AA`, `vata`, `dosha`
- Check spelling

### Problem: "CORS error" (in browser console)
**Solution**:
- This is normal for direct browser fetch
- Use Postman instead
- Or use your React app (CORS is handled)

### Problem: "Invalid JSON"
**Solution**:
- Check request body format
- Ensure valid JSON syntax
- Use examples from Postman collection

---

## 📱 Quick Reference Card

```
BASE URL: https://symbiomed.onrender.com

ENDPOINTS:
✅ GET  /health
✅ GET  /fhir/CodeSystem/$lookup
✅ GET  /fhir/ValueSet/$expand
✅ GET  /fhir/ConceptMap/$translate
✅ GET  /fhir/ValueSet/$validate-code
✅ POST /fhir/ValueSet/$validate-code
✅ POST /fhir/ingest/problem-list
✅ POST /fhir/validate/dual-code
✅ GET  /fhir/bundle
✅ POST /fhir/bundle/upload

TEST CODES: AA, AB, AC, AD
TEST SEARCH: vata, dosha, pitta
```

---

## ✅ Final Checklist

Before demo/presentation, verify:

- [ ] Health check returns 200
- [ ] Search returns results
- [ ] Lookup shows code details
- [ ] Translate shows mapping
- [ ] Validate confirms code
- [ ] Problem list creates resource
- [ ] Dual code validates
- [ ] Bundle operations work
- [ ] Web app displays data
- [ ] No console errors

---

**Last Updated**: December 5, 2025  
**Status**: All 10 endpoints operational ✅
