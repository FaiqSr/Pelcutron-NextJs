const DashboardPreview = () => {
  return (
    <section id="dashboard" className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
          Dashboard Monitoring
        </h2>
        <div className="grid gap-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border p-4">
              <div className="text-xs text-muted-foreground">Avg DO</div>
              <div className="text-2xl font-semibold">7.2</div>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="text-xs text-muted-foreground">Temp</div>
              <div className="text-2xl font-semibold">28.5 °C</div>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="text-xs text-muted-foreground">pH</div>
              <div className="text-2xl font-semibold">8.1</div>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="text-xs text-muted-foreground">Salinity</div>
              <div className="text-2xl font-semibold">15.2 ‰</div>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border p-4">
              <div className="text-sm font-semibold mb-2">Pond Readings</div>
              <div
                className="h-48 rounded bg-secondary"
                data-ai-hint="line chart"
              ></div>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <div className="text-sm font-semibold mb-2">Daily Trend</div>
              <div
                className="h-48 rounded bg-secondary"
                data-ai-hint="bar chart"
              ></div>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border p-4">
              <div className="text-sm font-semibold mb-2">Notifications</div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• DO dropped below threshold on Pond A</li>
                <li>• pH stabilized after treatment</li>
                <li>• Boat completed patrol route</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <div className="text-sm font-semibold mb-2">Recent Activity</div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• User B updated feeding schedule</li>
                <li>• Firmware v1.2 deployed to Boat 03</li>
                <li>• New pond added to Site 2</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
