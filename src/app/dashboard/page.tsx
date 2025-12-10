'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  CategoryScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  CategoryScale
);

// Mock data, replace with your actual data fetching
const alats = [
  { id: 1, nama: 'Alat 1', type: 'Tipe A', kwh: 1.2 },
  { id: 2, nama: 'Alat 2', type: 'Tipe B', kwh: 1.5 },
];
const PRICE_PER_KWH = 1500;

const emptyConfig = (label: string, color: string) => ({
  data: {
    labels: [],
    datasets: [
      {
        label,
        data: [],
        borderColor: color,
        backgroundColor: color,
        fill: false,
        tension: 0.1,
      },
    ],
  },
  options: {
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'minute' as const,
        },
      },
    },
  },
});

export default function DashboardPage() {
  const [lastSync, setLastSync] = useState('just now');
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentAlat, setCurrentAlat] = useState('Tidak ada');

  const [rpmValue, setRpmValue] = useState('—');
  const [beratValue, setBeratValue] = useState('—');
  const [wattValue, setWattValue] = useState('—');
  const [rupiahValue, setRupiahValue] = useState('—');
  
  const [chartDataRPM, setChartDataRPM] = useState(emptyConfig('RPM', '#10B981').data);
  const [chartDataBerat, setChartDataBerat] = useState(emptyConfig('Berat', '#7C3AED').data);
  const [chartDataWatt, setChartDataWatt] = useState(emptyConfig('Daya (W)', '#2563EB').data);
  const [chartDataRupiah, setChartDataRupiah] = useState(emptyConfig('Biaya (Rp)', '#EF4444').data);


  const handleMonitor = (alat: any) => {
    setIsMonitoring(true);
    setCurrentAlat(alat.nama);
    // In a real app, you would start fetching data here.
    // For now, we just show the monitor area.
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setCurrentAlat('Tidak ada');
    // Clear charts and values
  };
  
    const handleSaveSettings = () => {
    const rpm = (document.getElementById('modalRPM') as HTMLSelectElement)?.value;
    const berat = (document.getElementById('modalBerat') as HTMLInputElement)?.value;

    alert(`Setting disimpan!\nRPM: ${rpm}\nBerat: ${berat}`);
    setIsSettingOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-semibold">
          Dashboard Pelcutron
        </h1>
        <div id="lastSync" className="text-xs sm:text-sm text-zinc-600">
          Last sync: {lastSync}
        </div>
      </div>

      <div className="mt-4">
        <Button onClick={() => setIsSettingOpen(true)}>
          Input Pengaturan
        </Button>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Daftar Alat</h2>
          <div className="text-sm text-zinc-500">
            Pilih alat untuk monitoring realtime
          </div>
        </div>

        <div className="overflow-x-auto bg-white border border-zinc-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-600">
              <tr>
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">Nama</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Kwh</th>
                <th className="px-3 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {alats.length > 0 ? (
                alats.map((alat, idx) => (
                  <tr className="border-t" key={alat.id}>
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2">{alat.nama}</td>
                    <td className="px-3 py-2">{alat.type}</td>
                    <td className="px-3 py-2">{alat.kwh}</td>
                    <td className="px-3 py-2">
                      <button
                        className="px-3 py-1 rounded bg-emerald-600 text-white text-sm"
                        onClick={() => handleMonitor(alat)}
                      >
                        Monitor
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-2" colSpan={5}>
                    Belum ada data alat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-sm">
          Monitoring sekarang: <span id="currentAlat">{currentAlat}</span>
          <Button
            id="stopMonitoringBtn"
            variant="outline"
            className="ml-3 h-auto px-2 py-1 text-sm"
            onClick={stopMonitoring}
            disabled={!isMonitoring}
          >
            Stop
          </Button>
        </div>
      </div>
      
      {isMonitoring && (
        <div id="monitorArea">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="rounded-xl bg-zinc-900 text-white p-4">
              <div className="text-sm text-zinc-300">Mode RPM</div>
              <div className="text-2xl font-semibold" id="rpmValue">
                {rpmValue}
              </div>
              <div className="mt-2 text-xs text-zinc-400">Status: Stabil</div>
            </div>

            <div className="rounded-xl bg-zinc-900 text-white p-4">
              <div className="text-sm text-zinc-300">Target Berat Pelet</div>
              <div className="text-2xl font-semibold" id="beratValue">
                {beratValue}
              </div>
              <div className="mt-2 text-xs text-zinc-400">Akurasi Sensor Baik</div>
            </div>

            <div className="rounded-xl bg-zinc-600 text-white p-4">
              <div className="text-sm text-zinc-300">Daya Digunakan</div>
              <div className="text-2xl font-semibold" id="wattValue">
                {wattValue}
              </div>
              <div className="mt-2 text-xs text-zinc-400">Real-time</div>
            </div>

            <div className="rounded-xl bg-zinc-600 text-white p-4">
              <div className="text-sm text-zinc-300">Biaya Pemakaian Daya (1 jam)</div>
              <div className="text-2xl font-semibold" id="rupiahValue">
                {rupiahValue}
              </div>
              <div className="mt-2 text-xs text-zinc-400">Estimasi</div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-zinc-200 p-4">
                <div className="font-semibold mb-2">Grafik RPM</div>
                <Line {...emptyConfig('RPM', '#10B981')} data={chartDataRPM} />
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
                <div className="font-semibold mb-2">Grafik Berat Load Cell</div>
                <Line {...emptyConfig('Berat', '#7C3AED')} data={chartDataBerat} />
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
                <div className="font-semibold mb-2">Grafik Daya (W)</div>
                <Line {...emptyConfig('Daya (W)', '#2563EB')} data={chartDataWatt} />
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
                <div className="font-semibold mb-2">Grafik Biaya Kumulatif (Rp)</div>
                <Line {...emptyConfig('Biaya (Rp)', '#EF4444')} data={chartDataRupiah} />
            </div>
          </div>
        </div>
      )}
      
      <Dialog open={isSettingOpen} onOpenChange={setIsSettingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Input Pengaturan Mesin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label htmlFor="modalRPM">Set Mode RPM</Label>
                 <Select name="rpm" id="modalRPM">
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Level RPM" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="800">Level 1 – 800 RPM</SelectItem>
                        <SelectItem value="1000">Level 2 – 1000 RPM</SelectItem>
                        <SelectItem value="1200">Level 3 – 1200 RPM</SelectItem>
                        <SelectItem value="1400">Level 4 – 1400 RPM</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label htmlFor="modalBerat">Target Berat Pelet (Kg)</Label>
                <Input type="number" id="modalBerat" placeholder="Masukkan berat" />
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingOpen(false)}>Batal</Button>
            <Button onClick={handleSaveSettings}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
