# Luxury Black & Gold Theme - Figma Implementation Guide
## For Quintessence Pens Configurator

---

## 🎨 COLOR PALETTE FOR FIGMA

### Primary Colors

**Black Tones:**
```
Luxury Black:     oklch(0.15 0.01 270)  → HEX: #0a0a0f
Luxury Navy:      oklch(0.18 0.015 260) → HEX: #12121a
Luxury Charcoal:  oklch(0.25 0.01 265)  → HEX: #1e1e28
```

**Gold Tones:**
```
Main Gold:        oklch(0.75 0.15 85)   → HEX: #d4af37
Gold Light:       oklch(0.82 0.14 88)   → HEX: #f0d97d
Gold Dark:        oklch(0.65 0.16 82)   → HEX: #b8941f
Gold Muted:       oklch(0.70 0.10 85)   → HEX: #c9a857
```

**Neutral Grays (Warm):**
```
Gray 50:  #fdfcfb  (Almost white)
Gray 100: #f8f7f5  (Very light)
Gray 200: #ebe9e5  (Light)
Gray 300: #d9d6d0  (Medium-light)
Gray 400: #b3aea5  (Medium)
Gray 500: #8a8379  (Dark)
Gray 600: #655f54  (Darker)
Gray 700: #4a4539  (Very dark)
Gray 800: #37332b  (Near black)
Gray 900: #272419  (Almost black)
```

---

## 🎯 FIGMA COLOR STYLES TO CREATE

### Step 1: Create These Color Styles

**In Figma, create color styles with these exact names:**

1. **Primary Blacks:**
   - `Luxury/Black` - #0a0a0f
   - `Luxury/Navy` - #12121a
   - `Luxury/Charcoal` - #1e1e28

2. **Primary Golds:**
   - `Luxury/Gold` - #d4af37
   - `Luxury/Gold Light` - #f0d97d
   - `Luxury/Gold Dark` - #b8941f
   - `Luxury/Gold Muted` - #c9a857

3. **Neutrals:**
   - `Neutral/50` through `Neutral/900` (use hex codes above)

4. **Semantic Colors:**
   - `Background` - #fdfcfb (light mode) / #0a0a0f (dark mode)
   - `Foreground` - #0a0a0f (light mode) / #fdfcfb (dark mode)
   - `Card` - #ffffff
   - `Border` - #ebe9e5
   - `Accent` - #d4af37 (gold)

---

## 🖼️ COMPONENT COLOR ASSIGNMENTS

### 3D Viewer Panel

**Background:**
```
Type: Radial Gradient
- Center: #12121a (Luxury Navy)
- Edge: #0a0a0f (Luxury Black)
- Outer: #000000 (Pure Black)
```

**Optional Overlay:**
```
Add subtle gold glow:
- Radial gradient overlay
- Center: #d4af37 at 5% opacity
- Edge: Transparent
- Position: 30% from top-left
```

**Logo:**
```
- Font: Playfair Display, Bold, 24px
- Color: #d4af37 (Gold) at 90% opacity
- OR: #fdfcfb (Near White) at 90% opacity
```

---

### Configuration Panel

**Background:**
```
- Fill: #ffffff (Pure White)
- OR: #fdfcfb (Very light warm gray for softer look)
```

**Header Section:**

*Pen Name:*
```
- Font: Playfair Display, Bold, 32px
- Color: #0a0a0f (Luxury Black)
```

*Tagline Badge:*
```
- Background: Linear gradient 135°
  - Start: #b8941f (Gold Dark)
  - End: #d4af37 (Main Gold)
- Text: #0a0a0f (Black), 11px, Bold, Uppercase
- Border-radius: 12px
- Padding: 6px × 12px
- Shadow: 0 2px 8px #d4af37 at 25% opacity
```

*Description:*
```
- Color: #655f54 (Gray 600)
- Font: Inter, 14px, Regular
```

*Progress Dots:*
```
- Active: #d4af37 (Gold)
- Inactive: #ebe9e5 (Gray 200)
- Size: 8px diameter
- Optional: Add subtle gold glow to active dot
```

---

### Navigation Tabs

**Active Tab:**
```
- Background: Linear gradient vertical
  - Top: #0a0a0f (Black)
  - Bottom: #12121a (Navy)
- Icon: #d4af37 (Gold), 20px
- Text: #d4af37 (Gold), 13px, Semi-bold
- Border-bottom: 3px solid #d4af37
- Optional: Add subtle gold glow shadow
```

**Inactive Tab:**
```
- Background: Transparent
- Icon: #8a8379 (Gray 500), 20px
- Text: #8a8379 (Gray 500), 13px, Medium
- Hover: Background #f8f7f5 (Gray 100)
```

---

### Option Cards

**Default State:**
```
- Background: #ffffff
- Border: 1.5px solid #ebe9e5 (Gray 200)
- Border-radius: 8px
- Shadow: 0 2px 4px rgba(10,10,15,0.05)
```

**Hover State:**
```
- Border: 1.5px solid #c9a857 (Gold Muted)
- Shadow: 0 4px 12px rgba(212,175,55,0.15) (Gold glow)
- Transform: translateY(-2px)
```

**Selected State:**
```
- Background: #fdfcfb (Near white)
- Border: 2px solid #d4af37 (Gold)
- Shadow: 0 0 20px rgba(212,175,55,0.25) (Gold glow)
- Checkmark circle:
  - Background: Linear gradient
    - #0a0a0f to #12121a
  - Border: 1px solid #d4af37
  - Icon: #d4af37 (Gold checkmark)
```

**Card Content:**
```
- Image/Swatch: As needed for material
- Title: #0a0a0f, 15px, Semi-bold
- Description: #655f54, 13px, Regular
- Price: #d4af37 (Gold), 13px, Bold
```

---

### Quantity Selector

**Container:**
```
- Background: #f8f7f5 (Gray 100)
- Border: 1px solid #ebe9e5 (Gray 200)
- Border-radius: 8px
- Padding: 16px
```

**Label:**
```
- Icon: #4a4539 (Gray 700), 20px
- Text: #0a0a0f (Black), 14px, Semi-bold
- Helper text: #8a8379 (Gray 500), 12px
```

**Stepper Control:**
```
- Background: #ffffff
- Border: 1.5px solid #d9d6d0 (Gray 300)
- Border-radius: 8px
- Height: 40px
```

**Stepper Buttons:**
```
- Default:
  - Icon: #4a4539 (Gray 700), 16px
  - Background: Transparent
- Hover:
  - Background: #d4af37 (Gold)
  - Icon: #0a0a0f (Black)
- Active:
  - Background: #b8941f (Gold Dark)
  - Icon: #0a0a0f (Black)
```

**Number Display:**
```
- Color: #0a0a0f (Black)
- Font: 16px, Bold, Tabular
```

**Bulk Notice:**
```
- Background: Linear gradient
  - #f0d97d at 10% opacity (Gold Light)
- Border: 1px solid #d4af37 at 30% opacity
- Border-radius: 4px
- Icon: #d4af37, 14px
- Text: #b8941f (Gold Dark), 12px
```

---

### Price Summary Card

**Container:**
```
- Background: Linear gradient vertical
  - Top: #f0d97d at 15% opacity
  - Bottom: #d4af37 at 20% opacity
- Border: 1px solid #d4af37 at 40% opacity
- Border-radius: 8px
- Padding: 16px
```

**Content:**
```
- Labels: #4a4539 (Gray 700), 12px, Semi-bold, Uppercase
- Values: #0a0a0f (Black), 14-20px, Bold
- Divider: 1px solid #d4af37 at 30% opacity
- Total value: #0a0a0f, 20px, Bold
```

---

### Add to Cart Button

**Primary State:**
```
- Background: Linear gradient 135°
  - Start: #0a0a0f (Black)
  - End: #12121a (Navy)
- Border: 1px solid #d4af37 (Gold)
- Text: #d4af37 (Gold), 15px, Bold
- Border-radius: 8px
- Height: 52px
- Shadow: 0 0 20px rgba(212,175,55,0.25) (Gold glow)
```

**Hover State:**
```
- Background: Linear gradient 135°
  - Start: #d4af37 (Gold)
  - End: #f0d97d (Gold Light)
- Text: #0a0a0f (Black), 15px, Bold
- Shadow: 0 0 30px rgba(212,175,55,0.40) (Stronger gold glow)
- Transform: translateY(-2px)
```

**Loading State:**
```
- Same background as default
- Spinner: #d4af37 (Gold), 24px
- Text: "Adding..." at 70% opacity
```

**Success State:**
```
- Background: #d4af37 (Gold)
- Icon: #0a0a0f (Black checkmark), 20px
- Text: "Added to Cart!" #0a0a0f (Black), 15px, Bold
- Duration: 2 seconds
```

---

### Action Buttons

**Default State:**
```
- Background: Transparent
- Border: 1.5px solid #d9d6d0 (Gray 300)
- Icon: #4a4539 (Gray 700), 18px
- Text: #4a4539 (Gray 700), 13px, Medium
- Border-radius: 8px
- Height: 44px
```

**Hover State:**
```
- Background: #f8f7f5 (Gray 100)
- Border: 1.5px solid #d4af37 (Gold)
- Icon: #d4af37 (Gold), 18px
- Text: #d4af37 (Gold), 13px, Semi-bold
```

---

### Floating Price Badge

**Container:**
```
- Background: Linear gradient 135°
  - Start: #0a0a0f at 95% opacity
  - End: #12121a at 95% opacity
- Backdrop blur: 12px (Layer blur in Figma)
- Border: 1px solid #d4af37
- Border-radius: 32px (pill)
- Height: 64px
- Padding: 16px × 24px
- Shadow: 0 12px 48px rgba(212,175,55,0.30)
```

**Content:**
```
- Label: #8a8379 (Gray 500), 11px, Bold, Uppercase
- Price: #d4af37 (Gold), 24px, Bold, Tabular
- Chevron: #d4af37 (Gold), 20px
```

**Hover State:**
```
- Transform: scale(1.02)
- Shadow: 0 16px 60px rgba(212,175,55,0.40)
- Border glow: Add outer glow effect
```

---

## 🎨 GRADIENTS LIBRARY

Create these as color styles or effects:

**1. Gold Metallic:**
```
Linear gradient 145°:
- 0%: #b8941f (Gold Dark)
- 45%: #d4af37 (Gold)
- 55%: #f0d97d (Gold Light)
- 100%: #d4af37 (Gold)
```

**2. Black Luxury:**
```
Linear gradient 135°:
- 0%: #0a0a0f (Black)
- 50%: #12121a (Navy)
- 100%: #1e1e28 (Charcoal)
```

**3. 3D Viewer Radial:**
```
Radial gradient (ellipse at center):
- 0%: #12121a (Navy)
- 70%: #0a0a0f (Black)
- 100%: #000000 (Pure Black)
```

**4. Card Hover Glow:**
```
Radial gradient:
- Center: #d4af37 at 20% opacity
- Edge: Transparent
- Use as layer blend overlay
```

---

## ✨ EFFECT STYLES (SHADOWS)

### Standard Shadows (for Figma Effects)

**Light Shadow:**
```
Layer > Effects > Drop Shadow:
- X: 0, Y: 2
- Blur: 4
- Spread: 0
- Color: #0a0a0f at 5% opacity
```

**Medium Shadow:**
```
Drop Shadow 1:
- X: 0, Y: 4
- Blur: 6
- Color: #0a0a0f at 5% opacity

Drop Shadow 2:
- X: 0, Y: 10
- Blur: 15
- Color: #0a0a0f at 10% opacity
```

**Heavy Shadow:**
```
Drop Shadow 1:
- X: 0, Y: 8
- Blur: 10
- Color: #0a0a0f at 3% opacity

Drop Shadow 2:
- X: 0, Y: 20
- Blur: 25
- Color: #0a0a0f at 10% opacity
```

### Gold Glow Effects

**Subtle Gold Glow:**
```
Layer > Effects > Drop Shadow:
- X: 0, Y: 0
- Blur: 20
- Spread: 0
- Color: #d4af37 at 25% opacity
```

**Strong Gold Glow:**
```
Drop Shadow 1:
- X: 0, Y: 0
- Blur: 40
- Color: #d4af37 at 30% opacity

Drop Shadow 2:
- X: 0, Y: 4
- Blur: 32
- Color: #d4af37 at 20% opacity
```

**Inner Gold Glow:**
```
Layer > Effects > Inner Shadow:
- X: 0, Y: 0
- Blur: 10
- Spread: -5
- Color: #d4af37 at 10% opacity
```

---

## 🎭 BLEND MODES & EFFECTS

### Shimmer Effect (for gold elements)

1. Create element with gold fill
2. Add rectangle on top
3. Fill with linear gradient:
   - 0%: Transparent
   - 50%: #ffffff at 20%
   - 100%: Transparent
4. Rotate 45°
5. Set blend mode: Overlay
6. Optional: Animate position for shimmer

### Metallic Texture

1. Base: Gold color (#d4af37)
2. Add noise: 5% opacity
3. Add gradient overlay (vertical):
   - Top: #f0d97d at 10%
   - Bottom: #b8941f at 10%
4. Blend mode: Multiply

---

## 🎯 COMPONENT VARIANTS

### Button Component

Create variants for:
- **State:** Default, Hover, Active, Loading, Success, Disabled
- **Style:** Primary (gold), Secondary (outline), Ghost

**Primary Button States:**
```
Default:  Black bg, Gold text, Gold border, Gold glow
Hover:    Gold bg, Black text, Stronger glow
Active:   Gold Dark bg, Black text
Loading:  Black bg, Gold spinner
Success:  Gold bg, Black text, Checkmark
Disabled: Gray bg, Gray text, No border
```

### Card Component

Create variants for:
- **State:** Default, Hover, Selected, Disabled
- **Size:** Small (48px image), Medium (64px), Large (80px)

---

## 📐 LAYOUT ADJUSTMENTS

### Desktop (1440px)

**3D Viewer (864px - 60%):**
```
- Background: Black radial gradient
- Logo: Top-left, Gold at 90% opacity
- Pen model: Center, with gold rim light
```

**Config Panel (576px - 40%):**
```
- Background: White or very light warm gray
- All luxury styling applied to components
- Gold accents throughout
- Black typography
```

### Mobile (375px)

**All components:**
- Maintain gold/black contrast
- Ensure touch targets have gold feedback
- Floating badge: Black bg, gold border & text

---

## 🎨 TYPOGRAPHY SETTINGS

**Display/Headings:**
```
Font: Playfair Display
Weight: Bold (700)
Color: #0a0a0f (Black) in light mode
Color: #d4af37 (Gold) in dark mode
Letter-spacing: -0.01em
```

**Body Text:**
```
Font: Inter
Weight: Regular (400), Medium (500), Semi-bold (600)
Color: #0a0a0f (headings)
Color: #655f54 (body)
Color: #8a8379 (muted)
```

**Gold Accent Text:**
```
Font: Inter
Weight: Bold (700)
Color: #d4af37 (Gold)
Use for: Prices, CTAs, Labels, Highlights
```

---

## ✅ FIGMA IMPLEMENTATION CHECKLIST

- [ ] Import/create all color styles (blacks, golds, grays)
- [ ] Create gradient styles (metallic gold, black luxury, etc.)
- [ ] Set up effect styles (shadows and gold glows)
- [ ] Update 3D viewer background (radial gradient)
- [ ] Apply gold to logo
- [ ] Update header badge to gold gradient
- [ ] Restyle progress dots (gold active)
- [ ] Update navigation tabs (black/gold active state)
- [ ] Restyle option cards (gold borders, gold glow on select)
- [ ] Update quantity selector (gold button hovers)
- [ ] Restyle price summary card (gold gradient background)
- [ ] Update Add to Cart button (black bg, gold text, gold border)
- [ ] Restyle action buttons (gold on hover)
- [ ] Update floating price badge (black bg, gold text/border)
- [ ] Apply gold accents to all interactive elements
- [ ] Add gold glow effects to primary CTAs
- [ ] Verify contrast ratios (WCAG AA minimum)
- [ ] Create component variants for all states
- [ ] Set up auto-layout with new color styles
- [ ] Export color styles for development
- [ ] Test dark mode version

---

## 🎯 PRO TIPS

**Consistency:**
- Use gold (#d4af37) for ALL primary actions
- Use black (#0a0a0f) for ALL primary surfaces (dark mode)
- Maintain 90% opacity on white text over black
- Maintain 90% opacity on gold over dark backgrounds

**Hierarchy:**
- Most important: Gold with glow
- Important: Gold without glow
- Standard: Black or dark gray
- Subtle: Light gray

**Interactivity:**
- Hover: Add gold color + glow
- Active: Darken + reduce glow
- Selected: Gold border + subtle glow
- Disabled: Remove all gold, use gray

**Balance:**
- Don't overuse gold - it should feel precious
- Use black as the dominant color
- Gold for accents, highlights, and CTAs only
- White/light gray for readability surfaces

---

This luxury theme transforms your configurator into a premium, high-end experience worthy of $1000+ fountain pens!