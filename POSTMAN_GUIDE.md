# Postman API Testing Guide - SymbioMed Terminology Service

## 📋 Base URL
```
https://symbiomed.onrender.com
```

---

## 🧪 API Endpoints for Postman

### 1. Health Check

**Method**: `GET`  
**URL**: 
```
https://symbiomed.onrender.com/health
```

**Headers**: None required

**Expected Response**:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

### 2. CodeSystem $lookup

**Method**: `GET`  
**URL**: 
```
https://symbiomed.onrender.com/fhir/CodeSystem/$lookup?system=http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda&code=AA
```

**Query Parameters**:
- `system`: `http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda`
- `code`: `AA` (or any valid code)

**Headers**: None required

**Expected Response**:
```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "display",
      "valueString": "..."
    },
    {
      "name": "definition",
      "valueString": "..."
    }
  ]
}
```

**Test with different codes**: `AA`, `AB`, `AC`, `AD`

---

### 3. ValueSet $expand

**Method**: `GET`  
**URL**: 
```
https://symbiomed.onrender.com/fhir/ValueSet/$expand?url=http://sih.gov.in/fhir/ValueSet/namaste-ayurveda&filter=vata
```

**Query Parameters**:
- `url`: `http://sih.gov.in/fhir/ValueSet/namaste-ayurveda`
- `filter`: `vata` (or any search term)

**Headers**: None required

**Expected Response**:
```json
{
  "resourceType": "ValueSet",
  "expansion": {
    "contains": [
      {
        "system": "http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda",
        "code": "...",
        "display": "..."
      }
    ]
  }
}
```

**Test with different filters**: `dosha`, `pitta`, `kapha`, `a`

---

### 4. ConceptMap $translate

**Method**: `GET`  
**URL**: 
```
https://symbiomed.onrender.com/fhir/ConceptMap/$translate?url=urn:conceptmap:NAMASTE_TO_ICD11_TM2_MAPPING&system=urn:namaste&target=http://id.who.int/icd/entity&code=AA
```

**Query Parameters**:
- `url`: `urn:conceptmap:NAMASTE_TO_ICD11_TM2_MAPPING`
- `system`: `urn:namaste`
- `target`: `http://id.who.int/icd/entity`
- `code`: `AA`

**Headers**: None required

**Expected Response**:
```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "match",
      "part": [
        {
          "name": "equivalence",
          "valueCode": "equivalent"
        },
        {
          "name": "concept",
          "part": [
            {
              "name": "code",
              "valueCode": "..."
            },
            {
              "name": "display",
              "valueString": "..."
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 5. ValueSet $validate-code (GET)

**Method**: `GET`  
**URL**: 
```
https://symbiomed.onrender.com/fhir/ValueSet/$validate-code?url=http://sih.gov.in/fhir/ValueSet/namaste-ayurveda&system=http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda&code=AA
```

**Query Parameters**:
- `url`: `http://sih.gov.in/fhir/ValueSet/namaste-ayurveda`
- `system`: `http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda`
- `code`: `AA`

**Headers**: None required

**Expected Response**:
```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "result",
      "valueBoolean": true
    }
  ]
}
```

---

### 6. ValueSet $validate-code (POST)

**Method**: `POST`  
**URL**: 
```
https://symbiomed.onrender.com/fhir/ValueSet/$validate-code
```

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "url": "http://sih.gov.in/fhir/ValueSet/namaste-ayurveda",
  "system": "http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda",
  "code": "AA"
}
```

**Expected Response**:
```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "result",
      "valueBoolean": true
    }
  ]
}
```

---

### 7. Ingest Problem List (Create FHIR Condition)

**Method**: `POST`  
**URL**: 
```
https://symbiomed.onrender.com/fhir/ingest/problem-list
```

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "ayushCode": "AA",
  "ayushSystem": "http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda",
  "clinicalStatus": "active",
  "verificationStatus": "confirmed",
  "encounterClass": "AMB",
  "onsetDate": "2024-12-05"
}
```

**Expected Response**: FHIR Condition resource

**Field Options**:
- `clinicalStatus`: `active`, `recurrence`, `relapse`, `inactive`, `remission`, `resolved`
- `verificationStatus`: `confirmed`, `unconfirmed`, `provisional`, `differential`, `refuted`, `entered-in-error`
- `encounterClass`: `AMB`, `EMER`, `IMP`, `HH`, `VR`

---

### 8. Validate Dual Code

**Method**: `POST`  
**URL**: 
```
https://symbiomed.onrender.com/fhir/validate/dual-code
```

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "ayushCode": "AA",
  "ayushSystem": "http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda"
}
```

**Expected Response**:
```json
{
  "isValid": true,
  "message": "Dual coding is valid",
  "ayushCode": "AA",
  "icd11Code": "...",
  "mappingFound": true
}
```

---

### 9. Get Bundle

**Method**: `GET`  
**URL**: 
```
https://symbiomed.onrender.com/fhir/bundle
```

**Headers**: None required

**Expected Response**: FHIR Bundle resource

---

### 10. Upload Bundle

**Method**: `POST`  
**URL**: 
```
https://symbiomed.onrender.com/fhir/bundle/upload
```

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON) - Sample Bundle:
```json
{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "CodeSystem",
        "id": "test-codesystem",
        "url": "http://example.org/test-codesystem",
        "status": "active",
        "content": "complete",
        "name": "TestCodeSystem",
        "description": "A test code system for demonstration"
      }
    },
    {
      "resource": {
        "resourceType": "ValueSet",
        "id": "test-valueset",
        "url": "http://example.org/test-valueset",
        "status": "active",
        "name": "TestValueSet",
        "description": "A test value set"
      }
    }
  ]
}
```

**Expected Response**: Upload confirmation or created Bundle

---

## 🚀 Quick Setup in Postman

### Step 1: Create New Collection
1. Open Postman
2. Click "New" → "Collection"
3. Name it: "SymbioMed Terminology Service"

### Step 2: Add Base URL Variable
1. Click on your collection
2. Go to "Variables" tab
3. Add variable:
   - **Variable**: `baseUrl`
   - **Initial Value**: `https://symbiomed.onrender.com`
   - **Current Value**: `https://symbiomed.onrender.com`

### Step 3: Create Requests
For each endpoint above:
1. Click "Add Request"
2. Name it (e.g., "Health Check")
3. Set method (GET/POST)
4. Use URL: `{{baseUrl}}/path`
5. Add headers if needed
6. Add body if POST request

---

## 📝 Postman Collection JSON

You can import this directly into Postman:

```json
{
  "info": {
    "name": "SymbioMed Terminology Service",
    "description": "FHIR Terminology API endpoints for SIH 2024",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://symbiomed.onrender.com"
    }
  ],
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/health",
          "host": ["{{baseUrl}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "CodeSystem $lookup",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/fhir/CodeSystem/$lookup?system=http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda&code=AA",
          "host": ["{{baseUrl}}"],
          "path": ["fhir", "CodeSystem", "$lookup"],
          "query": [
            {
              "key": "system",
              "value": "http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda"
            },
            {
              "key": "code",
              "value": "AA"
            }
          ]
        }
      }
    },
    {
      "name": "ValueSet $expand",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/fhir/ValueSet/$expand?url=http://sih.gov.in/fhir/ValueSet/namaste-ayurveda&filter=vata",
          "host": ["{{baseUrl}}"],
          "path": ["fhir", "ValueSet", "$expand"],
          "query": [
            {
              "key": "url",
              "value": "http://sih.gov.in/fhir/ValueSet/namaste-ayurveda"
            },
            {
              "key": "filter",
              "value": "vata"
            }
          ]
        }
      }
    },
    {
      "name": "ConceptMap $translate",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/fhir/ConceptMap/$translate?url=urn:conceptmap:NAMASTE_TO_ICD11_TM2_MAPPING&system=urn:namaste&target=http://id.who.int/icd/entity&code=AA",
          "host": ["{{baseUrl}}"],
          "path": ["fhir", "ConceptMap", "$translate"],
          "query": [
            {
              "key": "url",
              "value": "urn:conceptmap:NAMASTE_TO_ICD11_TM2_MAPPING"
            },
            {
              "key": "system",
              "value": "urn:namaste"
            },
            {
              "key": "target",
              "value": "http://id.who.int/icd/entity"
            },
            {
              "key": "code",
              "value": "AA"
            }
          ]
        }
      }
    },
    {
      "name": "ValueSet $validate-code (GET)",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/fhir/ValueSet/$validate-code?url=http://sih.gov.in/fhir/ValueSet/namaste-ayurveda&system=http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda&code=AA",
          "host": ["{{baseUrl}}"],
          "path": ["fhir", "ValueSet", "$validate-code"],
          "query": [
            {
              "key": "url",
              "value": "http://sih.gov.in/fhir/ValueSet/namaste-ayurveda"
            },
            {
              "key": "system",
              "value": "http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda"
            },
            {
              "key": "code",
              "value": "AA"
            }
          ]
        }
      }
    },
    {
      "name": "ValueSet $validate-code (POST)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"url\": \"http://sih.gov.in/fhir/ValueSet/namaste-ayurveda\",\n  \"system\": \"http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda\",\n  \"code\": \"AA\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/fhir/ValueSet/$validate-code",
          "host": ["{{baseUrl}}"],
          "path": ["fhir", "ValueSet", "$validate-code"]
        }
      }
    },
    {
      "name": "Ingest Problem List",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"ayushCode\": \"AA\",\n  \"ayushSystem\": \"http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda\",\n  \"clinicalStatus\": \"active\",\n  \"verificationStatus\": \"confirmed\",\n  \"encounterClass\": \"AMB\",\n  \"onsetDate\": \"2024-12-05\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/fhir/ingest/problem-list",
          "host": ["{{baseUrl}}"],
          "path": ["fhir", "ingest", "problem-list"]
        }
      }
    },
    {
      "name": "Validate Dual Code",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"ayushCode\": \"AA\",\n  \"ayushSystem\": \"http://sih.gov.in/fhir/CodeSystem/namaste-ayurveda\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/fhir/validate/dual-code",
          "host": ["{{baseUrl}}"],
          "path": ["fhir", "validate", "dual-code"]
        }
      }
    },
    {
      "name": "Get Bundle",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/fhir/bundle",
          "host": ["{{baseUrl}}"],
          "path": ["fhir", "bundle"]
        }
      }
    },
    {
      "name": "Upload Bundle",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"resourceType\": \"Bundle\",\n  \"type\": \"collection\",\n  \"entry\": [\n    {\n      \"resource\": {\n        \"resourceType\": \"CodeSystem\",\n        \"id\": \"test\",\n        \"url\": \"http://example.org/test\",\n        \"status\": \"active\",\n        \"content\": \"complete\"\n      }\n    }\n  ]\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/fhir/bundle/upload",
          "host": ["{{baseUrl}}"],
          "path": ["fhir", "bundle", "upload"]
        }
      }
    }
  ]
}
```

---

## 📥 How to Import

### Method 1: Import JSON File
1. Save the JSON above to a file: `SymbioMed-Postman.json`
2. Open Postman
3. Click "Import" button
4. Drag and drop the JSON file or browse to select it
5. Click "Import"

### Method 2: Manual Setup
Follow the "Quick Setup" section above to create requests manually

---

## ⚡ Testing Tips

### First Request May Be Slow
- The backend is hosted on Render free tier
- First request after inactivity may take 30-60 seconds (server wakes up)
- Subsequent requests will be fast

### Test Sequence
1. Start with **Health Check** to wake up server
2. Test **$expand** with search term
3. Use a code from results to test **$lookup**
4. Use same code for **$translate**
5. Test other endpoints

### Response Validation
- Check HTTP status codes (200, 201 for success)
- Verify JSON structure
- Check FHIR `resourceType` field

### Save Responses
- Use Postman's "Save Response" feature
- Create examples for documentation
- Share with team

---

## 🔍 Troubleshooting

### CORS Error
- Not applicable for Postman (server-to-server)
- If using browser, the web app handles this

### Connection Timeout
- Server may be sleeping (first request)
- Wait 60 seconds and retry
- Check if `symbiomed.onrender.com` is accessible

### Invalid Response
- Check request body format (must be valid JSON)
- Verify required fields are present
- Check parameter spelling and case

---

## 📊 Sample Test Results

All endpoints should return:
- ✅ Status 200/201
- ✅ Valid FHIR JSON
- ✅ Correct `resourceType`
- ✅ Expected data structure

---

**Last Updated**: December 5, 2025  
**API Version**: v1  
**Base URL**: `https://symbiomed.onrender.com`
