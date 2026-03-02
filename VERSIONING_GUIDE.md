# Skyway Suites - Versioning Guide

## 📋 Current Version: **2.14**

**Last Updated:** March 2, 2026

---

## 🔢 Versioning Scheme

Skyway Suites uses a **Major.Edit** versioning format:

```
Major.Edit
```

### **Format Breakdown**

- **Major Version** (e.g., `2` in `2.14`): Represents the major iteration of the app
- **Edit Number** (e.g., `14` in `2.14`): Tracks the number of edits/changes made

---

## 📈 Version Progression

### **Standard Progression**
```
2.1 → 2.2 → 2.3 → ... → 2.98 → 2.99 → 2.100
```

### **After Edit 100**
When the edit number reaches **100**, the major version increments:

```
2.100 → 3.1
```

Then the cycle continues:
```
3.1 → 3.2 → 3.3 → ... → 3.100 → 4.1
```

---

## 🎯 Examples

| Current Version | Next Edit | New Version |
|----------------|-----------|-------------|
| 2.1 | 1 edit | 2.2 |
| 2.14 | 1 edit | 2.15 |
| 2.50 | 1 edit | 2.51 |
| 2.99 | 1 edit | 2.100 |
| 2.100 | 1 edit | 3.1 |
| 3.1 | 1 edit | 3.2 |
| 3.100 | 1 edit | 4.1 |

---

## 📂 Where Version Numbers Appear

### **1. package.json**
```json
{
  "name": "@figma/my-make-file",
  "version": "2.14",
  ...
}
```

### **2. Backup Files**
```json
{
  "timestamp": "2026-03-02T12:00:00.000Z",
  "version": "2.14",
  "data": { ... }
}
```

### **3. Documentation**
```markdown
# Skyway Suites - Complete Documentation

**Version:** 2.14
**Last Updated:** March 2, 2026
```

---

## 🔄 Update Process

### **When to Update Version**

Update the version number in these files after making significant changes:

1. **`package.json`** - Line 4
2. **`/src/app/pages/admin/SettingsPage.tsx`** - Line 456 (backup version)
3. **`DOCUMENTATION.md`** - Header and footer
4. **This file** (`VERSIONING_GUIDE.md`) - Header

### **How to Update**

#### **Step 1: Increment Edit Number**
```
Current: 2.14
Next: 2.15
```

#### **Step 2: Check if Edit Number = 100**
```
If edit number = 100:
  Major version + 1
  Edit number = 1
  
Example: 2.100 → 3.1
```

#### **Step 3: Update All Files**
- Update `package.json`
- Update `SettingsPage.tsx` backup version
- Update `DOCUMENTATION.md` version header
- Update version history in `DOCUMENTATION.md`

---

## 🗂️ Version History Quick Reference

| Version | Date | Major Changes |
|---------|------|---------------|
| 2.14 | Mar 2, 2026 | Supabase-first architecture, instant sync |
| 1.82 | Mar 1, 2026 | Auto-connect Supabase, real-time sync |
| 1.81 | Feb 28, 2026 | Email uniqueness validation |
| 1.80 | Feb 27, 2026 | Complete backup & restore system |
| 1.73 | Feb 22, 2026 | Complete Supabase integration |
| 1.70 | Feb 21, 2026 | Automatic WebP conversion |

---

## 🚀 Future Versions

### **Upcoming Version Numbers**
```
2.15 - Next immediate update
2.16 - Following update
...
2.100 - 100th edit of version 2
3.1 - First edit of version 3
...
3.100 - 100th edit of version 3
4.1 - First edit of version 4
```

### **Major Version Milestones**
- **Version 2.x** - Supabase-first architecture era
- **Version 3.x** - After 100 edits (future)
- **Version 4.x** - After 200 edits (future)

---

## 📝 Notes

### **Why This System?**
- ✅ **Simple** - Easy to understand and increment
- ✅ **Trackable** - Clear edit count visible in version number
- ✅ **Scalable** - Can grow indefinitely
- ✅ **Consistent** - Same format across all versions

### **Best Practices**
- Always update version after significant changes
- Keep version numbers consistent across all files
- Document major changes in version history
- Use semantic versioning principles (breaking changes = new major version)

---

## 🔍 Quick Check

**Current Version Locations:**
- [ ] `/package.json` - Version 2.14
- [ ] `/src/app/pages/admin/SettingsPage.tsx` - Version 2.14
- [ ] `/DOCUMENTATION.md` - Version 2.14
- [ ] `/VERSIONING_GUIDE.md` - Version 2.14

---

*Last Updated: March 2, 2026 | Version: 2.14*
