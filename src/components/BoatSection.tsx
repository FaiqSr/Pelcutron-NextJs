const BoatSection = () => {
  return (
    <section id="boat" className="py-10 sm:py-16 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
          IoT‑Based Monitoring Boat
        </h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div
            className="aspect-[16/10] rounded-2xl bg-secondary"
            data-ai-hint="robot boat water"
          ></div>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="font-semibold mb-2">AquaPel Monitoring Robot</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>Real‑time DO, pH, temperature, salinity</li>
                <li>GPS routes, auto‑patrol, docking</li>
                <li>LoRa/Wi‑Fi connectivity</li>
                <li>Water sampling module</li>
              </ul>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border bg-background p-4 text-center">
                <div className="text-2xl font-semibold">4h</div>
                <div className="text-xs text-muted-foreground">Battery life</div>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 text-center">
                <div className="text-2xl font-semibold">±0.1</div>
                <div className="text-xs text-muted-foreground">pH accuracy</div>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 text-center">
                <div className="text-2xl font-semibold">IP67</div>
                <div className="text-xs text-muted-foreground">Ruggedized</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <div className="rounded-2xl border border-border bg-background p-5">
            <h3 className="font-semibold mb-3">Sensor Suite</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li>Dissolved Oxygen</li>
                <li>pH & Temperature</li>
                <li>Salinity & Turbidity</li>
              </ul>
              <ul className="list-disc pl-5 space-y-1">
                <li>GPS & IMU</li>
                <li>Water Level</li>
                <li>Battery & System Health</li>
              </ul>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5">
            <h3 className="font-semibold mb-3">Integrated Design (ESP32)</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li>Telemetry via MQTT</li>
                <li>Local buffering</li>
                <li>OTA firmware updates</li>
              </ul>
              <ul className="list-disc pl-5 space-y-1">
                <li>Failsafe return‑to‑dock</li>
                <li>Modular sensor bay</li>
                <li>Open API</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoatSection;
