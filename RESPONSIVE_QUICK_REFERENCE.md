# Responsive Design Quick Reference

## 🎯 Common Responsive Patterns

### **Padding & Spacing**
```tsx
// Responsive padding (most common)
className="p-3 sm:p-4 md:p-6"

// Responsive gap
className="gap-2 sm:gap-3 md:gap-4"

// Responsive margin
className="mt-4 sm:mt-6 md:mt-8"
```

---

### **Layout Direction**
```tsx
// Stack on mobile, row on desktop
className="flex flex-col sm:flex-row"

// Reverse on mobile
className="flex flex-col-reverse sm:flex-row"

// Grid columns
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
```

---

### **Width & Size**
```tsx
// Full width on mobile, auto on desktop
className="w-full sm:w-auto"

// Responsive max width
className="max-w-full sm:max-w-md lg:max-w-2xl"

// Responsive height
className="h-48 sm:h-64 md:h-80"
```

---

### **Typography**
```tsx
// Responsive font size
className="text-sm sm:text-base md:text-lg"

// Responsive heading
className="text-2xl sm:text-3xl md:text-4xl"

// Truncate long text
className="truncate max-w-[200px]"

// Word break
className="break-words"
```

---

### **Images & Icons**
```tsx
// Responsive image
<img className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 object-cover" />

// Responsive icon
<Icon className="w-4 h-4 sm:w-5 sm:h-5" />

// Prevent shrinking
className="flex-shrink-0"
```

---

### **Buttons**
```tsx
// Full width on mobile
<Button className="w-full sm:w-auto">
  Submit
</Button>

// Responsive padding
<Button className="px-3 py-1.5 sm:px-4 sm:py-2">
  Click
</Button>

// Responsive text
<Button className="text-xs sm:text-sm md:text-base">
  Action
</Button>
```

---

### **Tables**
```tsx
// Scrollable table
<div className="overflow-x-auto">
  <table className="w-full min-w-[640px]">
    <thead>
      <tr>
        <th className="px-3 sm:px-4 md:px-6 py-3">Name</th>
      </tr>
    </thead>
  </table>
</div>

// With custom scrollbar
<div className="overflow-x-auto scrollbar-thin">
  {/* table */}
</div>
```

---

### **Show/Hide Elements**
```tsx
// Hide on mobile, show on desktop
className="hidden md:block"

// Show on mobile, hide on desktop
className="block md:hidden"

// Different content per breakpoint
<div className="md:hidden">Mobile Content</div>
<div className="hidden md:block">Desktop Content</div>
```

---

### **Flex Distribution**
```tsx
// Grow equally on mobile
className="flex-1 sm:flex-none"

// Center on mobile, left on desktop
className="justify-center sm:justify-start"

// Different alignment
className="items-start sm:items-center"
```

---

## 📐 Breakpoint Cheat Sheet

| Breakpoint | Min Width | Class Prefix | Typical Device |
|------------|-----------|--------------|----------------|
| Default | 0px | (none) | Mobile portrait |
| `sm` | 640px | `sm:` | Mobile landscape, small tablets |
| `md` | 768px | `md:` | Tablets, small laptops |
| `lg` | 1024px | `lg:` | Laptops, desktops |
| `xl` | 1280px | `xl:` | Large desktops |
| `2xl` | 1536px | `2xl:` | Extra large screens |

---

## 🎨 Common Spacing Values

| Class | Pixels | Use For |
|-------|--------|---------|
| `p-1` | 4px | Tight icon padding |
| `p-2` | 8px | Compact elements |
| `p-3` | 12px | **Mobile default** |
| `p-4` | 16px | **Tablet default** |
| `p-6` | 24px | **Desktop default** |
| `p-8` | 32px | Generous spacing |

---

## 📏 Recommended Patterns

### **Page Container**
```tsx
<div className="p-3 sm:p-4 md:p-6">
  {/* Page content */}
</div>
```

### **Section Header**
```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div>
    <h1 className="text-2xl sm:text-3xl font-bold">Title</h1>
    <p className="text-sm text-gray-600 mt-1">Description</p>
  </div>
  <div className="flex flex-wrap gap-2">
    <Button className="flex-1 sm:flex-none">Action 1</Button>
    <Button className="flex-1 sm:flex-none">Action 2</Button>
  </div>
</div>
```

### **Card Grid**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  {items.map(item => (
    <Card key={item.id} />
  ))}
</div>
```

### **Form Layout**
```tsx
<form className="space-y-4 sm:space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input label="Name" />
    <Input label="Email" />
  </div>
  
  <div className="flex flex-col sm:flex-row gap-3 justify-end">
    <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
    <Button className="w-full sm:w-auto">Submit</Button>
  </div>
</form>
```

---

## ⚠️ Common Mistakes

### **❌ DON'T**
```tsx
// Fixed width - breaks on small screens
<div className="w-[800px]">

// No responsive padding
<div className="p-6">

// Fixed pixel values for touch targets
<button className="p-1">
  <Icon className="w-3 h-3" />
</button>

// No overflow handling
<table className="w-full">
```

### **✅ DO**
```tsx
// Max width with full responsiveness
<div className="w-full max-w-4xl">

// Responsive padding
<div className="p-3 sm:p-4 md:p-6">

// Responsive touch targets
<button className="p-1.5 sm:p-2">
  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
</button>

// Scrollable tables
<div className="overflow-x-auto">
  <table className="w-full min-w-[640px]">
</div>
```

---

## 🎯 Touch Target Sizes

### **Minimum Touch Target: 44×44px**

```tsx
// Too small ❌
<button className="p-1">
  <Icon className="w-3 h-3" />
</button>
// Total: 16px (padding) + 12px (icon) = 28px ❌

// Perfect ✅
<button className="p-2">
  <Icon className="w-4 h-4" />
</button>
// Total: 16px (padding) + 16px (icon) = 32px + 8px padding = 48px ✅
```

---

## 📱 Mobile-First Approach

### **Always start with mobile, then scale up:**

```tsx
// ✅ GOOD: Mobile-first
<div className="p-3 sm:p-4 md:p-6">
  <h1 className="text-2xl sm:text-3xl">
    Title
  </h1>
</div>

// ❌ BAD: Desktop-first
<div className="p-6 md:p-4 sm:p-3">
  <h1 className="text-3xl sm:text-2xl">
    Title
  </h1>
</div>
```

---

## 🔍 Testing Checklist

### **Mobile (< 640px)**
- [ ] No horizontal scrolling
- [ ] All buttons min 44×44px
- [ ] Text readable (min 14px)
- [ ] Images scale properly
- [ ] Forms stack vertically
- [ ] Modals fit on screen

### **Tablet (640px - 1024px)**
- [ ] Two-column layouts work
- [ ] Proper spacing
- [ ] Touch targets adequate
- [ ] Navigation accessible

### **Desktop (> 1024px)**
- [ ] Generous whitespace
- [ ] Multi-column layouts
- [ ] Hover states work
- [ ] Content not stretched too wide

---

## 🎨 Utility Class Combos

### **Responsive Card**
```tsx
className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
```

### **Responsive Button**
```tsx
className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg"
```

### **Responsive Input**
```tsx
className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border rounded-lg"
```

### **Responsive Container**
```tsx
className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8"
```

---

## 📊 Performance Tips

1. **Use CSS instead of JS** for responsive behavior
2. **Avoid layout shifts** - reserve space for images
3. **Lazy load images** below the fold
4. **Use responsive images** with `srcset`
5. **Minimize breakpoint changes** - stick to sm, md, lg

---

## 🚀 Quick Wins

### **Convert Fixed to Responsive:**

```tsx
// BEFORE
<div className="p-6">
  <h1 className="text-3xl">Title</h1>
  <div className="flex gap-4">
    <Button>Action</Button>
  </div>
</div>

// AFTER (5 second fix!)
<div className="p-3 sm:p-4 md:p-6">
  <h1 className="text-2xl sm:text-3xl">Title</h1>
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
    <Button className="w-full sm:w-auto">Action</Button>
  </div>
</div>
```

---

## 📝 Copy-Paste Templates

### **Admin Page Header**
```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  <div>
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Page Title</h1>
    <p className="text-sm text-gray-600 mt-1">Page description</p>
  </div>
  <div className="flex flex-wrap gap-2">
    <Button variant="outline" className="flex-1 sm:flex-none">Secondary</Button>
    <Button className="w-full sm:w-auto">Primary Action</Button>
  </div>
</div>
```

### **Responsive Table**
```tsx
<div className="bg-white rounded-lg border overflow-hidden">
  <div className="overflow-x-auto scrollbar-thin">
    <table className="w-full min-w-[640px]">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
            Column
          </th>
        </tr>
      </thead>
      <tbody className="divide-y">
        <tr className="hover:bg-gray-50">
          <td className="px-3 sm:px-4 md:px-6 py-4 text-sm">
            Content
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### **Responsive Form**
```tsx
<form className="space-y-4 sm:space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="text-sm font-medium">Label</label>
      <input className="w-full px-3 py-2 sm:px-4 sm:py-2.5 mt-1 border rounded-lg" />
    </div>
  </div>
  
  <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t">
    <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
    <Button className="w-full sm:w-auto">Submit</Button>
  </div>
</form>
```

---

**Save this file for quick reference when building responsive layouts!** 📱💻

*Last Updated: March 2, 2026*
