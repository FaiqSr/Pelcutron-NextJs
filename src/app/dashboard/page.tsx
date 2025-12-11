'use client';
import { useState, useEffect } from 'react';
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
import { useFirebase } from '@/firebase';
import { getDatabase, ref, onValue, off, set, get, update } from 'firebase/database';

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

const PRICE_PER_KWH = 1500;

const emptyConfig = (label: string, color: string) => ({
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
});

type Alat = {
  id: string;
  Nama: string;
  Type: string;
  KWH: number;
};

type DataPoint = {
  t: number;
  rpm: number | null;
  berat: number | null;
  watt: number | null;
};

export default function DashboardPage() {
  const [alats, setAlats] = useState<Alat[]>([]);
  const [lastSync, setLastSync] = useState('never');
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentAlat, setCurrentAlat] = useState<{ id: string; nama: string } | null>(null);

  const [rpmValue, setRpmValue] = useState('—');
  const [beratValue, setBeratValue] = useState('—');
  const [wattValue, setWattValue] = useState('—');
  const [rupiahValue, setRupiahValue] = useState('—');

  const [chartDataRPM, setChartDataRPM] = useState(emptyConfig('RPM', '#10B981').data);
  const [chartDataBerat, setChartDataBerat] = useState(emptyConfig('Berat', '#7C3AED').data);
  const [chartDataWatt, setChartDataWatt] = useState(emptyConfig('Daya (W)', '#2563EB').data);
  const [chartDataRupiah, setChartDataRupiah] = useState(emptyConfig('Biaya (Rp)', '#EF4444').data);

  // States for modal inputs
  const [modalLevel, setModalLevel] = useState('');
  const [modalBerat, setModalBerat] = useState('');
  const [modalThreshold, setModalThreshold] = useState('');
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

  const firebase = useFirebase();
  const db = firebase ? getDatabase(firebase.app) : null;

  useEffect(() => {
    if (!db) return;

    const alatsRef = ref(db, 'alat');
    const listener = onValue(alatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const alatList: Alat[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setAlats(alatList);
      } else {
        setAlats([]);
      }
    });

    return () => off(alatsRef, 'value', listener);
  }, [db]);

  const computeEnergyAndCost = (points: DataPoint[]) => {
    if (!points || points.length < 2) return { kwh: 0, cost: 0, cumulative: [] };
  
    let totalWhSeconds = 0;
    const cumulative: { t: number; cost: number }[] = [];
    let accWhSeconds = 0;
  
    for (let i = 0; i < points.length - 1; i++) {
        const p = points[i];
        const next = points[i+1];
        const dt = Number(next.t) - Number(p.t); // seconds
        const power = Number(p.watt) || 0; // W
        const contribution = power * dt; // W * s
        
        if (!isNaN(contribution)) {
          accWhSeconds += contribution;
          const kwhSoFar = accWhSeconds / 3600000;
          cumulative.push({ t: next.t * 1000, cost: kwhSoFar * PRICE_PER_KWH });
        }
    }
  
    totalWhSeconds = accWhSeconds;
    const totalKwh = totalWhSeconds / 3600000;
    const totalCost = totalKwh * PRICE_PER_KWH;
    return { kwh: totalKwh, cost: totalCost, cumulative };
  };

  useEffect(() => {
    if (!isMonitoring || !currentAlat || !db) return;
    
    // Listener for historical data to build charts and update cards
    const dataRef = ref(db, `data/${currentAlat.id}`);
    const dataListener = onValue(dataRef, (snapshot) => {
        const rawData = snapshot.val() || {};
        const points: DataPoint[] = Object.keys(rawData).map(key => ({
            t: Number(key),
            rpm: rawData[key].rpm,
            berat: rawData[key].berat,
            watt: rawData[key].watt,
        })).sort((a, b) => a.t - b.t);

        setDataPoints(points);
        setLastSync(new Date().toLocaleString());

        if (points.length > 0) {
            const lastPoint = points[points.length - 1];
            
            // Update cards with the latest data from the 'data' path
            setRpmValue(lastPoint.rpm?.toString() ?? '—');
            setBeratValue(lastPoint.berat ? `${lastPoint.berat.toFixed(2)} kg` : '—');
            setWattValue(lastPoint.watt ? `${lastPoint.watt} W` : '—');

            const { cost, cumulative } = computeEnergyAndCost(points);
            setRupiahValue(cost ? `Rp ${Math.round(cost).toLocaleString('id-ID')}` : '—');

            const labels = points.map(p => new Date(p.t * 1000));

            setChartDataRPM({
                labels,
                datasets: [{ ...chartDataRPM.datasets[0], data: points.map(p => p.rpm) }],
            });
            setChartDataBerat({
                labels,
                datasets: [{ ...chartDataBerat.datasets[0], data: points.map(p => p.berat) }],
            });
            setChartDataWatt({
                labels,
                datasets: [{ ...chartDataWatt.datasets[0], data: points.map(p => p.watt) }],
            });
            setChartDataRupiah({
                labels: cumulative.map(c => new Date(c.t)),
                datasets: [{ ...chartDataRupiah.datasets[0], data: cumulative.map(c => c.cost) }],
            });
        }
    });

    return () => {
      off(dataRef, 'value', dataListener);
    };
  }, [isMonitoring, currentAlat, db]);

  const handleMonitor = (alat: Alat) => {
    if (currentAlat?.id === alat.id && isMonitoring) return;
    
    stopMonitoring(); // Stop previous monitoring if any
    
    setIsMonitoring(true);
    setCurrentAlat({ id: alat.id, nama: alat.Nama });
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setCurrentAlat(null);
    // Clear charts and values
    setRpmValue('—');
    setBeratValue('—');
    setWattValue('—');
    setRupiahValue('—');
    setChartDataRPM(emptyConfig('RPM', '#10B981').data);
    setChartDataBerat(emptyConfig('Berat', '#7C3AED').data);
    setChartDataWatt(emptyConfig('Daya (W)', '#2563EB').data);
    setChartDataRupiah(emptyConfig('Biaya (Rp)', '#EF4444').data);
  };
  
  const handleOpenSettings = async () => {
    if (!currentAlat || !db) {
        alert("Pilih alat untuk dimonitor terlebih dahulu.");
        return;
    }
    
    const settingsRef = ref(db, `tools_value/${currentAlat.id}`);
    const snapshot = await get(settingsRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        setModalLevel(data.level?.toString() ?? '');
        setModalThreshold(data.threshold?.toString() ?? '');
    } else {
        // Reset if no data
        setModalLevel('');
        setModalBerat('');
        setModalThreshold('');
    }
    setIsSettingOpen(true);
};

  const handleSaveSettings = () => {
    if (!currentAlat || !db) {
        alert("Tidak ada alat yang sedang dimonitor.");
        return;
    }
    
    const settingsRef = ref(db, `tools_value/${currentAlat.id}`);
    
    const newSettings: { level?: number, threshold?: number } = {};

    const level = parseInt(modalLevel, 10);
    if (!isNaN(level)) newSettings.level = level;

    const threshold = parseFloat(modalThreshold);
    if (!isNaN(threshold)) newSettings.threshold = threshold;
    
    update(settingsRef, newSettings)
        .then(() => {
            alert("Pengaturan berhasil disimpan!");
            setIsSettingOpen(false);
        })
        .catch((error) => {
            console.error("Gagal menyimpan pengaturan: ", error);
            alert("Gagal menyimpan pengaturan.");
        });
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
        <Button onClick={handleOpenSettings} disabled={!isMonitoring}>
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
                    <td className="px-3 py-2">{alat.Nama}</td>
                    <td className="px-3 py-2">{alat.Type}</td>
                    <td className="px-3 py-2">{alat.KWH}</td>
                    <td className="px-3 py-2">
                      <button
                        className={`px-3 py-1 rounded text-white text-sm ${currentAlat?.id === alat.id && isMonitoring ? 'bg-blue-500' : 'bg-emerald-600'}`}
                        onClick={() => handleMonitor(alat)}
                      >
                        {currentAlat?.id === alat.id && isMonitoring ? 'Monitoring...' : 'Monitor'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-2 text-center" colSpan={5}>
                    Belum ada data alat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-sm">
          Monitoring sekarang: <span id="currentAlat">{currentAlat?.nama || 'Tidak ada'}</span>
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
              <div className="text-sm text-zinc-300">Berat Aktual</div>
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
              <div className="text-sm text-zinc-300">Biaya Pemakaian Daya</div>
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
                <Label htmlFor="modalLevel">Set Mode RPM</Label>
                 <Select name="level" id="modalLevel" value={modalLevel} onValueChange={setModalLevel}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Level RPM" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">Netral</SelectItem>
                        <SelectItem value="1">Level 1</SelectItem>
                        <SelectItem value="2">Level 2</SelectItem>
                        <SelectItem value="3">Level 3</SelectItem>
                        <SelectItem value="4">Level 4</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label htmlFor="modalThreshold">Threshold Berat (Kg)</Label>
                <Input type="number" id="modalThreshold" placeholder="Masukkan threshold" value={modalThreshold} onChange={e => setModalThreshold(e.target.value)} />
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

    