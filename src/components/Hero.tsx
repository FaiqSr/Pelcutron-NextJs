import Image from "next/image";
import image1 from "../assets/images/peternak-ayam.png";

const Hero = () => {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-16 grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent"></span>
            Empowering Smart Shrimp Farming
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Automate{" "}
            <span className="text-muted-foreground font-normal">
              Monitoring with
            </span>{" "}
            Pelcutron System
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Real‑time pond metrics, anomaly alerts, and insights to maximize
            growth and reduce risk—powered by our IoT monitoring boat and
            integrated dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
              Request Demo
            </button>
            <button className="px-5 py-2 rounded-full border border-border hover:bg-secondary text-sm">
              Learn More
            </button>
          </div>
          <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">295.4K+</span>{" "}
              data points daily
            </div>
            <div className="hidden sm:block h-4 w-px bg-border"></div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">728M+</span> happy
              shrimps
              <div className="flex -space-x-2">
                <div className="h-5 w-5 rounded-full bg-primary"></div>
                <div className="h-5 w-5 rounded-full bg-primary/80"></div>
                <div className="h-5 w-5 rounded-full bg-primary/60"></div>
                <div className="h-5 w-5 rounded-full bg-primary/40"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div
            className="aspect-[4/3] w-full rounded-2xl bg-secondary"
            data-ai-hint="shrimp farm boat"
          >
            <Image src={image1} alt="" className="rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
