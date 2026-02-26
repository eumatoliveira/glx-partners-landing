type GsapModule = {
  gsap: any;
  ScrollTrigger: any;
};

let gsapClientPromise: Promise<GsapModule | null> | null = null;

export function shouldLoadGsap(): boolean {
  return typeof window !== "undefined";
}

export async function getGsapClient(): Promise<GsapModule | null> {
  if (!shouldLoadGsap()) return null;
  if (gsapClientPromise) return gsapClientPromise;

  gsapClientPromise = (async () => {
    const [gsapImport, scrollTriggerImport] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);

    const gsap = (gsapImport as any).default ?? (gsapImport as any).gsap ?? gsapImport;
    const ScrollTrigger =
      (scrollTriggerImport as any).ScrollTrigger ??
      (scrollTriggerImport as any).default ??
      scrollTriggerImport;

    if (gsap?.registerPlugin && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    return { gsap, ScrollTrigger };
  })();

  return gsapClientPromise;
}

