# 拼豆库存管理工具 - 开发计划

## Design Guidelines

### Design References
- **Hello Kitty / Sanrio Style**: Pastel pink, cute characters, rounded shapes
- **Kawaii UI Design**: Soft colors, bubbly elements, playful typography
- **Style**: Cute Kawaii + Mobile-First + Pastel Pink Theme

### Color Palette
- Primary: #FF85A2 (Pastel Pink - main accent)
- Secondary: #FFB6C1 (Light Pink - backgrounds)
- Accent: #FF69B4 (Hot Pink - CTAs and highlights)
- Background: #FFF0F5 (Lavender Blush - page bg)
- Card: #FFFFFF (White - card bg)
- Text: #4A4A4A (Dark Gray - primary text)
- Text Secondary: #9CA3AF (Gray - secondary text)
- Success: #7EC8A0 (Mint Green - in stock)
- Warning: #FFB347 (Pastel Orange - low stock)
- Danger: #FF6B8A (Pink Red - out of stock)

### Typography
- Heading: Nunito font-weight 700 (rounded, cute feel)
- Body: Nunito font-weight 400
- Navigation: Nunito font-weight 600

### Key Component Styles
- **Buttons**: Pink gradient, white text, 16px rounded, soft shadow
- **Cards**: White bg, 16px rounded, soft pink border, hover: slight lift
- **Bottom Nav**: Pink gradient bg, white icons, cute emoji labels
- **Color Swatches**: Circular, 40px, with subtle shadow
- **Input Fields**: Rounded, pink focus border, soft shadow

### Cute Elements
- 🎀 Ribbon decorations on headers
- 🐱 Cat face SVG decorations (Hello Kitty inspired)
- ✨ Sparkle animations
- 💕 Heart icons for favorites/low stock
- Pastel gradient backgrounds
- Bouncy micro-animations on interactions

### Images to Generate
1. **cute-cat-mascot.png** - A cute white cat character face (Hello Kitty inspired, original design), pastel pink bow, simple kawaii style (Style: kawaii illustration, pastel colors, transparent background)
2. **empty-state-beads.png** - Cute illustration of scattered colorful beads with a sad face, kawaii style (Style: kawaii illustration, pastel colors, transparent background)
3. **header-decoration.png** - Decorative banner with cute cat paw prints and stars, pastel pink theme (Style: kawaii pattern, pastel colors, transparent background)

---

## Development Tasks

- [x] Create color data file with all 265 bead color codes, categories, and hex values
- [x] Create inventory management hook with localStorage persistence
- [x] Create Layout component with bottom navigation and cute decorations
- [x] Create StockEditor component (bottom sheet for editing stock, threshold, history)
- [x] Build main inventory page with category filter and color grid
- [x] Build low stock alert page
- [x] Build operation history page
- [x] Update App.tsx with routes and index.css with cute theme
- [x] Run lint and build checks