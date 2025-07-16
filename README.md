# Bulletins

An immersive web experience featuring a parallax-scrolling train journey through a landscape with interactive signposts

## Features

- **Parallax Scrolling**: Multi-layered landscape with different scroll speeds for depth
- **Interactive Train**: Animated train that responds to movement with smoke effects
- **Signpost System**: Clickable signposts that trigger slideshow presentations
- **Speed Control**: Adjustable movement speed (1x, 2x, 4x, 8x)
- **Keyboard Navigation**: Use A/D or arrow keys to move left/right
- **Responsive Design**: Built with Tailwind CSS for modern styling

## Controls

- **A** or **Left Arrow**: Move train left
- **D** or **Right Arrow**: Move train right
- **Speed Buttons**: Click 1x, 2x, 4x, or 8x to adjust movement speed
- **Signposts**: Click on signposts to view associated slide presentations
- **ESC**: Close slideshow and return to journey

## Project Structure

```
src/
├── components/
│   ├── Scene.tsx           # Main scene orchestrator
│   ├── LandscapeLayer.tsx  # Individual parallax layers
│   ├── Train.tsx           # Animated train component
│   ├── Rails.tsx           # Railway tracks
│   ├── SignpostLayer.tsx   # Signpost positioning and interaction
│   ├── Signpost.tsx        # Individual signpost component
│   ├── Slideshow.tsx       # Presentation viewer
│   └── SmokeAnimation.tsx  # Train smoke effects
├── config/
│   └── signpostSlides.ts   # Signpost-to-slide mappings
└── app/
    ├── page.tsx            # Main application page
    └── layout.tsx          # App layout and metadata
```

## Assets

The project includes various visual assets:
- **Landscape layers**: Multi-depth background images
- **Train sprites**: Static and animated train graphics
- **Signpost images**: Interactive waypoint markers
- **Slide content**: Presentation images for each signpost
- **Grass textures**: Foreground vegetation elements
- **Smoke effects**: Animated particle sequences

## Getting Started

First, install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to begin the journey.

## Technology Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Hooks**: State management and effects

## Development

The application uses a layered architecture where:

1. **Scene.tsx** orchestrates all components and handles global state
2. **Parallax layers** move at different speeds to create depth illusion
3. **Signposts** are positioned relative to the mid-ground layer
4. **Train** remains centered while the world moves around it
5. **Slideshow** overlays provide content delivery mechanism

## Customization

- Add new landscape layers in `public/assets/landscape/`
- Configure signpost positions and slide ranges in `src/config/signpostSlides.ts`
- Add new slide content in `public/assets/slides/`
- Modify parallax speeds in the `speeds` object within `Scene.tsx`

## Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
