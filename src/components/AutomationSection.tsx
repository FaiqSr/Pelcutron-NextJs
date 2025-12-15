import image1 from "@/assets/images/pencacah-ayam.jpg";
import { Bot, LineChart } from "lucide-react";
import Image from "next/image";

const AutomationSection = () => {
  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-start">
        <div
          className="aspect-square rounded-2xl bg-secondary"
          data-ai-hint="aquaculture technology"
        >
          <Image
            src={image1}
            alt="Aquaculture technology"
            className="rounded-lg object-cover h-full w-full"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-semibold">
            Transforming Farmers{" "}
            <span className="text-muted-foreground font-normal">
              into Automation
            </span>
          </h2>
          <p className="text-muted-foreground">
            Automate daily monitoring, centralize records, and use predictive
            insights to plan better feeding and aeration schedules.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-full border border-border hover:bg-secondary text-sm">
              Impactful Ideas
            </button>
            <button className="px-4 py-2 rounded-full border border-border hover:bg-secondary text-sm">
              Future of Aquaculture
            </button>
            <button className="px-4 py-2 rounded-full border border-border hover:bg-secondary text-sm">
              Your Brand Today
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            <div className="rounded-xl border border-border p-4">
              <div className="h-8 w-8 rounded bg-primary text-primary-foreground mb-2 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div className="font-semibold">Automated Workflows</div>
              <p className="text-sm text-muted-foreground">
                Scale operations confidently with automated monitoring
                workflows.
              </p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="h-8 w-8 rounded bg-primary/80 text-primary-foreground mb-2 flex items-center justify-center">
                <LineChart size={20} />
              </div>
              <div className="font-semibold">Intuitive Dashboard</div>
              <p className="text-sm text-muted-foreground">
                Beautiful, intuitive dashboard for teams across farms and sites.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutomationSection;
