# Understanding Mapping Availability - SymbioMed

## ⚠️ "Mapping data not available" - What does it mean?

When you see this message, it means one of three things:

### 1. ✅ **No Mapping Exists (Most Common)**
The NAMASTE code exists and is valid, but it doesn't have an ICD-11 TM2 mapping in the ConceptMap yet.

**This is NORMAL** - Not all NAMASTE codes have been mapped to ICD-11 yet.

### 2. 🔄 **Server is Waking Up**
If this is your first request, the Render server may be sleeping (free tier). Wait 30-60 seconds and click the "Retry" button.

### 3. ❌ **API Error**
The ConceptMap $translate endpoint returned an error. Now the app will show you the specific error with details.

---

## ✅ Improved Error Messages

I've just updated your app to show **3 different messages**:

### 🔴 Red Error Box - API Failure
```
❌ Translation API Error
API returned status 500
The ConceptMap $translate endpoint returned an error.
The server may be starting up or experiencing issues.
[🔄 Retry Button]
```

### 🟡 Yellow Warning - No Mapping
```
⚠️ No Mapping Found  
No ICD-11 TM2 mapping exists for this code yet
This NAMASTE code exists but doesn't have an ICD-11 
TM2 mapping in the system yet.
```

### 🟡 Yellow Warning - Unknown
```
⚠️ Mapping data not available
This code may not have an ICD-11 TM2 mapping yet, 
or the API call failed.
[🔄 Retry Button]
```

---

## 🧪 How to Test

### Test with Known Codes:

Try these codes to see different results:

#### Codes That Should Have Mappings:
```
AA
AB
AC  
AD
```

#### How to Test:
1. Go to: `http://localhost:5173/`
2. Search for: `a` (shows many codes)
3. Click on code "AA"
4. Wait for mapping to load
5. If you see a **RED error box** → Server issue, click  Retry
6. If you see **YELLOW warning** → No mapping exists (normal)
7. If you see **GREEN box** → Mapping found! ✅

---

## 🔍 What to Do When You See the Warning

### Option 1: Wait and Retry (Server Waking Up)
1. Wait 30-60 seconds
2. Click the "🔄 Retry" button
3. Check if it loads now

### Option 2: Try a Different Code
1. Go back to search
2. Try codes: `AA`, `AB`, `AC`, `AD`
3. These are more likely to have mappings

### Option 3: Check API Directly
1. Go to: `http://localhost:5173/api-playground`
2. Click "$translate" tab
3. Enter code: `AA`
4. Click "Translate Code"
5. See the raw API response

### Option 4: Test in Postman
1. Open Postman
2. Use the "ConceptMap $translate" request
3. Change the `code` parameter
4. Click "Send"
5. Check the response

---

## 📊 Understanding the API Response

### ✅ Successful Mapping Response:
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
            {"name": "code", "valueCode": "MG30.00"},
            {"name": "display", "valueString": "..."},
            {"name": "system", "valueUri": "http://id.who.int/icd/entity"}
          ]
        }
      ]
    }
  ]
}
```

### ⚠️ No Mapping Response:
```json
{
  "resourceType": "Parameters",
  "parameter": []
}
```
OR
```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "result",
      "valueBoolean": false
    }
  ]
}
```

### ❌ Error Response:
```
HTTP Status: 500, 404, 503
{
  "error": "...",
  "message": "..."
}
```

---

## 🎯 Quick Troubleshooting

### Issue: All codes show "mapping not available"
**Cause**: Server may be sleeping or down  
**Solution**: 
1. Check health: `http://localhost:5173/api-playground` → "Check API Health"
2. Wait 60 seconds for server to wake up
3. Retry

### Issue: Sometimes it works, sometimes it doesn't
**Cause**: Render free tier sleeps after inactivity  
**Solution**: 
- First request after sleep takes longest
- Keep testing within 15 minutes to keep server awake

### Issue: Specific code never shows mapping
**Cause**: That code genuinely has no mapping  
**Solution**: 
- This is expected behavior
- Try codes: AA, AB, AC, AD
- Not all NAMASTE codes have ICD-11 mappings yet

---

## 💡 For Your Demo/Presentation

### Best Practice:
1. **Before demo**: Test the health endpoint to wake server
2. **Use known codes**: AA, AB, AC, AD
3. **If warning appears**: Explain this is expected - not all codes are mapped yet
4. **Show the retry button**: Demonstrates error handling
5. **Show API Playground**: Demonstrates transparency

### What to Tell Judges:
> "This application gracefully handles cases where mapping data isn't available. We display clear error messages to users and provide retry functionality. Not all NAMASTE codes have been mapped to ICD-11 TM2 yet, which is why you may see some codes without mappings - this is expected and part of the ongoing terminology mapping work."

---

## 📝 Summary

✅ **Updated Features**:
- More detailed error messages
- Different colors for different error types
- Retry buttons for failed API calls
- Better user guidance

✅ **Expected Behavior**:
- Some codes WILL show "no mapping" - This is normal!
- API errors are now red and more descriptive
- Missing mappings are yellow warnings
- Users can retry failed requests

✅ **Testing**:
- Try codes: AA, AB, AC, AD
- Use API Playground for direct testing
- Check health endpoint first
- Be patient on first request (server wake-up)

---

**Last Updated**: December 5, 2025  
**Status**: Enhanced error handling ✅  
**Action**: Refresh your browser to see the improved error messages!
