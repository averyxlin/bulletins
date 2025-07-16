// Configuration mapping signpost IDs to their slide ranges
export interface SignpostSlideConfig {
  signpostId: number;
  startSlide: number;
  endSlide: number;
  title?: string;
}

// Map each signpost (0-8) to a range of slides (1-36)
// You can customize these ranges as needed
export const signpostSlideConfig: SignpostSlideConfig[] = [
  { signpostId: 0, startSlide: 1, endSlide: 5, title: "Introduction" },
  { signpostId: 1, startSlide: 6, endSlide: 11, title: "Interwar/mobilizing militarism in the region" },
  { signpostId: 2, startSlide: 12, endSlide: 13, title: "Constructing Legitimacy" },
  { signpostId: 3, startSlide: 14, endSlide: 16, title: "Pan-Asianism and racial harmony" },
  { signpostId: 4, startSlide: 17, endSlide: 20, title: "Soft power in Occupation" },
  { signpostId: 5, startSlide: 21, endSlide: 26, title: "Visions of Empire" },
  { signpostId: 6, startSlide: 27, endSlide: 31, title: "Resistance" },
  { signpostId: 7, startSlide: 32, endSlide: 33, title: "Reflections" },
  { signpostId: 8, startSlide: 34, endSlide: 36, title: "Conclusions" }, 
];

// Helper function to get slide config for a signpost
export function getSlideConfigForSignpost(signpostId: number): SignpostSlideConfig | undefined {
  return signpostSlideConfig.find(config => config.signpostId === signpostId);
}

// Helper function to validate if all slides 1-37 are covered
export function validateSlideRanges(): boolean {
  const usedSlides = new Set<number>();
  
  signpostSlideConfig.forEach(config => {
    for (let i = config.startSlide; i <= config.endSlide; i++) {
      if (usedSlides.has(i)) {
        console.warn(`Slide ${i} is used by multiple signposts`);
        return false;
      }
      usedSlides.add(i);
    }
  });
  
  // Check if all slides 1-36 are covered
  for (let i = 1; i <= 36; i++) {
    if (!usedSlides.has(i)) {
      console.warn(`Slide ${i} is not assigned to any signpost`);
      return false;
    }
  }
  
  return true;
}
