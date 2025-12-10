import { Cpu, Zap, AreaChart } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-semibold leading-tight">
            Digitilize Shrimp Farmer{' '}
            <span className="text-muted-foreground font-normal">
              Through Innovation
            </span>
          </h2>
        </div>
        <div
          className="aspect-[4/3] rounded-2xl bg-secondary"
          data-ai-hint="shrimp farming technology"
        ></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-10">
        <div className="rounded-2xl border border-border p-6 sm:p-8">
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <Cpu size={24} />
              </div>
              <h3 className="font-semibold">Potential with Innovation</h3>
              <p className="text-sm text-muted-foreground">
                Capture pond metrics with sensors and automate routine checks to
                save time.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-primary/80 text-primary-foreground flex items-center justify-center">
                <Zap size={24} />
              </div>
              <h3 className="font-semibold">Turning Ideas into Impact</h3>
              <p className="text-sm text-muted-foreground">
                Alerts and insights turn data into action that improves pond
                outcomes.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-lg bg-primary/60 text-primary-foreground flex items-center justify-center">
                <AreaChart size={24} />
              </div>
              <h3 className="font-semibold">Data-Driven Insights</h3>
              <p className="text-sm text-muted-foreground">
                Large‑scale datasets enable benchmarking across ponds and
                seasons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
