# AI-Mart V1 - CSS Structure Documentation

## 📋 Overview

AI-Mart v1 mein CSS ka structure modular aur organized hai. Har component, layout, aur page ke liye alag CSS files hain jo maintainability aur scalability ko improve karte hain.

## 🗂️ CSS File Structure

```
client/src/
├── styles/
│   ├── main.css          # Main style file (CSS Variables, Utilities, Base Styles)
│   └── README.md         # This documentation
├── index.css             # Entry point (imports main.css)
├── App.css               # App-level styles
│
├── components/           # Component-specific CSS
│   ├── navbar/
│   │   ├── Navbar.css
│   │   ├── AuthNavbar.css
│   │   ├── UserNavbar.css
│   │   └── ToolOwnerNavbar.css
│   ├── footer/
│   │   └── Footer.css
│   ├── sidebar/
│   │   ├── FounderSidebar.css
│   │   └── ToolOwnerSidebar.css
│   ├── Toast/
│   │   └── toast.css
│   └── LogoutButton.jsx/
│       └── LogoutButton.css
│
├── layouts/              # Layout-specific CSS
│   ├── Public.css
│   ├── AuthLayout.css
│   ├── UserLayout.css
│   ├── ToolOwnerLayout.css
│   └── section/
│       └── SectionWrapper.css
│
└── pages/                # Page-specific CSS
    ├── Home/
    │   ├── Home.css
    │   ├── GreetingSection/
    │   ├── SearchSection/
    │   ├── TrendingSection/
    │   └── useCasedSection/
    ├── Login/
    │   └── Login.css
    ├── Register/
    │   └── Register.css
    ├── aiArt/
    │   ├── AiArt.css
    │   └── components/
    ├── Explore/
    │   ├── styles/
    │   └── steps/
    ├── founder/
    │   └── css/
    ├── toolOwner/
    │   └── css/
    └── user/
        └── css/
```

## 🎨 Main Style File (`styles/main.css`)

Yeh file sabse important hai kyunki ismein sab common styles, variables, aur utilities hain.

### 1. **CSS Variables (Design Tokens)**
   - **Colors**: Primary, Background, Text, Border, Status colors
   - **Spacing**: Consistent spacing scale (xs to 4xl)
   - **Typography**: Font family, sizes, weights, line heights
   - **Border Radius**: Consistent border radius values
   - **Shadows**: Pre-defined shadow styles
   - **Transitions**: Standard transition timings
   - **Z-Index**: Layering system
   - **Layout**: Container widths, sidebar width, navbar height

### 2. **Global Resets & Base Styles**
   - Box-sizing reset
   - Font smoothing
   - Base typography styles
   - Link styles

### 3. **Utility Classes**
   - **Display**: flex, flex-col, items-center, justify-between, etc.
   - **Spacing**: padding/margin utilities (p-sm, m-md, etc.)
   - **Text**: text-center, text-primary, font-medium, etc.
   - **Background**: bg-primary, bg-secondary, etc.
   - **Border**: rounded-md, border, etc.
   - **Shadow**: shadow-sm, shadow-md, shadow-card, etc.

### 4. **Common Component Patterns**
   - **Buttons**: .btn, .btn-primary, .btn-secondary
   - **Inputs**: .input with focus states
   - **Cards**: .card with hover effects
   - **Containers**: .container, .container-fluid
   - **Grid**: .grid, .grid-auto-fill, .grid-auto-fit

### 5. **Responsive Breakpoints**
   - Mobile: max-width 640px
   - Tablet: 641px - 1024px
   - Desktop: min-width 1025px

## 🎯 Design System

### Color Palette

#### Primary Colors
- **Primary**: `#4F46E5` (Indigo) - Main brand color
- **Primary Dark**: `#4338CA` - Hover states
- **Primary Light**: `#6366F1` - Accents

#### Background Colors
- **Primary**: `#FFFFFF` (White)
- **Secondary**: `#F3F4F6` (Light Grey) - Main background
- **Tertiary**: `#F8FAFC` - Subtle backgrounds
- **Dark**: `#0F172A` - Sidebar/Dark sections

#### Text Colors
- **Primary**: `#111827` - Main text
- **Secondary**: `#4B5563` - Secondary text
- **Tertiary**: `#6B7280` - Muted text
- **Light**: `#9CA3AF` - Very light text

#### Status Colors
- **Success**: `#16A34A` / `#22C55E`
- **Error**: `#DC2626`
- **Warning**: `#F59E0B`
- **Info**: `#2563EB`

### Typography

- **Font Family**: `'Inter', sans-serif`
- **Font Sizes**: xs (12px) to 4xl (36px)
- **Font Weights**: 400 (normal) to 800 (extrabold)
- **Line Heights**: tight (1.25), normal (1.5), relaxed (1.75)

### Spacing Scale

```
xs:  0.25rem  (4px)
sm:  0.5rem   (8px)
md:  1rem     (16px)
lg:  1.5rem   (24px)
xl:  2rem     (32px)
2xl: 2.5rem   (40px)
3xl: 3rem     (48px)
4xl: 4rem     (64px)
```

### Border Radius

```
sm:    6px
md:    8px
lg:    10px
xl:    12px
2xl:   14px
full:  9999px
```

## 📐 Layout Patterns

### 1. **Public Layout**
- Full-width background (`#F3F4F6`)
- Sticky navbar with backdrop blur
- Centered content container (max-width: 1300px)
- Footer at bottom

### 2. **Auth Layout**
- Centered login/register forms
- White card with shadow
- Minimal design

### 3. **Dashboard Layouts** (ToolOwner/Founder)
- Fixed sidebar (260px width)
- Dark sidebar (`#0F172A`)
- White top bar
- Content area with padding

### 4. **User Layout**
- Similar to Public Layout
- User-specific navbar
- Protected routes

## 🧩 Component Patterns

### Navbar
- Sticky positioning
- Backdrop blur effect
- Primary color for logo
- Hover transitions on links
- Button-style CTA links

### Cards
- White background
- Border radius: 10-14px
- Shadow on hover
- Transform translateY on hover
- Padding: 1-1.5rem

### Forms
- Inputs with focus ring
- Primary color focus state
- Consistent padding and border radius
- Button styles matching design system

### Tool Cards
- Grid layout (auto-fill, minmax 220px)
- Image section (140px height)
- Footer with tool name
- Hover effects with scale and shadow

## 📱 Responsive Design

### Mobile (< 640px)
- Reduced padding
- Smaller font sizes
- Stacked layouts
- Full-width containers

### Tablet (641px - 1024px)
- Adjusted grid columns
- Medium padding
- Optimized spacing

### Desktop (> 1024px)
- Full layout
- Maximum container width
- Optimal spacing

## 🔧 Usage Guidelines

### 1. **CSS Variables Use Karein**
```css
/* ✅ Good */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

/* ❌ Avoid */
.button {
  background-color: #4F46E5;
  padding: 1rem;
  border-radius: 8px;
}
```

### 2. **Utility Classes Use Karein**
```css
/* ✅ Good - Use utility classes */
<div className="flex items-center justify-between gap-md p-lg">

/* ❌ Avoid - Inline styles */
<div style={{display: 'flex', alignItems: 'center'}}>
```

### 3. **Component-Specific Styles**
- Har component ke liye apna CSS file
- BEM naming convention follow karein (optional)
- Consistent class naming

### 4. **Responsive Design**
- Mobile-first approach
- Media queries use karein
- Breakpoints follow karein

## 🚀 Best Practices

1. **CSS Variables**: Always use CSS variables for colors, spacing, etc.
2. **Utility Classes**: Common patterns ke liye utility classes use karein
3. **Component Isolation**: Har component ka apna CSS file
4. **Consistency**: Design system follow karein
5. **Performance**: Unused CSS avoid karein
6. **Accessibility**: Focus states, contrast ratios maintain karein
7. **Responsive**: Mobile-first approach follow karein

## 📝 File Naming Convention

- Component CSS: `ComponentName.css` (e.g., `Navbar.css`)
- Page CSS: `PageName.css` (e.g., `Home.css`)
- Layout CSS: `LayoutName.css` (e.g., `AuthLayout.css`)
- Utility CSS: `main.css` (main style file)

## 🔄 Migration Guide

Agar aap existing components ko update karna chahte hain:

1. **CSS Variables Use Karein**: Hard-coded values ko variables se replace karein
2. **Utility Classes**: Common patterns ko utility classes se replace karein
3. **Consistent Spacing**: Spacing scale follow karein
4. **Color Consistency**: Color variables use karein

## 📚 Resources

- Main Style File: `client/src/styles/main.css`
- Entry Point: `client/src/index.css`
- Design Tokens: CSS Variables in `:root`

---

**Note**: Yeh documentation AI-Mart v1 ke current CSS structure ko explain karti hai. Future updates ke liye is file ko maintain karein.
