const CTA = () => {
  return (
    <section className="py-12 sm:py-16 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h3 className="text-2xl sm:text-3xl font-semibold">
            Order Now{' '}
            <span className="text-muted-foreground font-normal">
              Your AquaPel System
            </span>
          </h3>
          <p className="text-muted-foreground mt-3">
            Bring automation and data‑driven decisions to your farm.
          </p>
          <div className="mt-6">
            <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
              Contact Sales
            </button>
          </div>
        </div>
        <div
          className="aspect-[4/3] rounded-2xl bg-secondary"
          data-ai-hint="shrimp farm water"
        ></div>
      </div>
    </section>
  );
};

export default CTA;
