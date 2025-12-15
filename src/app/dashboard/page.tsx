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
import { useFirebase } from '@/firebase';
import { getDatabase, ref, onValue, off } from 'firebase/database';

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
    if (!points || points.length < 2) return { kwh: 0, cost: 0, costByHour: [] };
    
    let totalWhSeconds = 0;
    const hourlyConsumption: { [hourStart: number]: number } = {}; // Store Watt-seconds per hour

    for (let i = 0; i < points.length - 1; i++) {
        const p = points[i];
        const next = points[i+1];
        const dt = Number(next.t) - Number(p.t); // seconds
        const power = Number(p.watt) || 0; // W
        const energyWhSeconds = power * dt; // W * s

        if (!isNaN(energyWhSeconds)) {
            totalWhSeconds += energyWhSeconds;

            const date = new Date(p.t * 1000);
            date.setMinutes(0, 0, 0); // floor to the hour
            const hourStartTimestamp = Math.floor(date.getTime() / 1000);

            if (!hourlyConsumption[hourStartTimestamp]) {
                hourlyConsumption[hourStartTimestamp] = 0;
            }
            hourlyConsumption[hourStartTimestamp] += energyWhSeconds;
        }
    }
    
    const totalKwh = totalWhSeconds / 3600000;
    const totalCost = totalKwh * PRICE_PER_KWH;
    
    const costByHour = Object.keys(hourlyConsumption).map(hourStart => {
        const hourTimestamp = parseInt(hourStart, 10) * 1000;
        const kwhForHour = hourlyConsumption[parseInt(hourStart, 10)] / 3600000;
        return { t: hourTimestamp, cost: kwhForHour * PRICE_PER_KWH };
    }).sort((a,b) => a.t - b.t);

    return { kwh: totalKwh, cost: totalCost, costByHour };
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

        setLastSync(new Date().toLocaleString());

        if (points.length > 0) {
            const lastPoint = points[points.length - 1];
            
            // Update cards with the latest data from the 'data' path
            setRpmValue(lastPoint.rpm?.toString() ?? '—');
            setBeratValue(lastPoint.berat ? `${lastPoint.berat.toFixed(2)} kg` : '—');
            setWattValue(lastPoint.watt ? `${lastPoint.watt} W` : '—');

            const { cost, costByHour } = computeEnergyAndCost(points);
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
            
            const costChartConfig = emptyConfig('Biaya (Rp)', '#EF4444');
            costChartConfig.options.scales!.x!.time!.unit = 'hour';
            
            setChartDataRupiah({
                labels: costByHour.map(c => new Date(c.t)),
                datasets: [{ ...costChartConfig.data.datasets[0], data: costByHour.map(c => c.cost) }],
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
                <div className="font-semibold mb-2">Grafik Biaya per Jam (Rp)</div>
                <Line {...emptyConfig('Biaya (Rp)', '#EF4444')} data={chartDataRupiah} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
