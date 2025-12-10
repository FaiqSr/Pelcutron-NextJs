'use client';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFirestore } from "@/firebase";
import { getDatabase, ref, onValue, get, query, orderByChild, startAt, endAt } from "firebase/database";
import { useEffect, useState } from "react";
import { format } from 'date-fns';

type HistoryData = {
    id: string;
    alat: string;
    timestamp: string;
    rpm: number;
    berat: number;
    watt: number;
};

type Alat = {
  id: string;
  Nama: string;
};

export default function HistoryPage() {
    const [alats, setAlats] = useState<Alat[]>([]);
    const [selectedAlat, setSelectedAlat] = useState('all');
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [filteredData, setFilteredData] = useState<HistoryData[]>([]);
    const [loading, setLoading] = useState(false);

    const firestore = useFirestore();
    const db = firestore ? getDatabase(firestore.app) : null;

    useEffect(() => {
        if (!db) return;
        const alatsRef = ref(db, 'alat');
        onValue(alatsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const alatList: Alat[] = Object.keys(data).map(key => ({ id: key, Nama: data[key].Nama }));
                setAlats(alatList);
            }
        });
    }, [db]);

    const handleFilter = async () => {
        if (!db) return;

        setLoading(true);
        let history: HistoryData[] = [];

        const alatIdsToFetch = selectedAlat === 'all' 
            ? alats.map(a => a.id) 
            : [selectedAlat];
        
        const startTimestamp = startDate ? Math.floor(startDate.getTime() / 1000) : 0;
        const endTimestamp = endDate ? Math.floor(endDate.getTime() / 1000) : Date.now();

        for (const alatId of alatIdsToFetch) {
            const dataRef = ref(db, `data/${alatId}`);
            const dataQuery = query(dataRef, orderByChild('timestamp'), startAt(startTimestamp), endAt(endTimestamp));
            
            const snapshot = await get(ref(db, `data/${alatId}`));

            if (snapshot.exists()) {
                const data = snapshot.val();
                const alatName = alats.find(a => a.id === alatId)?.Nama || 'Unknown';

                Object.keys(data).forEach(timestampKey => {
                    const ts = parseInt(timestampKey, 10);
                     if (ts >= startTimestamp && ts <= endTimestamp) {
                        const record = data[timestampKey];
                        history.push({
                            id: `${alatId}-${timestampKey}`,
                            alat: alatName,
                            timestamp: format(new Date(ts * 1000), 'yyyy-MM-dd HH:mm:ss'),
                            rpm: record.rpm,
                            berat: record.berat,
                            watt: record.watt,
                        });
                    }
                });
            }
        }
        
        // Sort by timestamp descending
        history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setFilteredData(history);
        setLoading(false);
    };

    return (
        <div>
            <h1 className="text-lg sm:text-xl font-semibold">Histori Data</h1>
            
            <div className="mt-6 p-4 border rounded-lg bg-zinc-50 grid md:grid-cols-4 gap-4 items-end">
                <div>
                    <Label htmlFor="alatSelect">Pilih Alat</Label>
                    <Select value={selectedAlat} onValueChange={setSelectedAlat}>
                        <SelectTrigger id="alatSelect">
                            <SelectValue placeholder="Semua Alat" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Alat</SelectItem>
                            {alats.map(alat => (
                                <SelectItem key={alat.id} value={alat.id}>{alat.Nama}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label>Tanggal Mulai</Label>
                    <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        className="p-0 [&_td]:w-8 [&_td]:h-8 [&_th]:w-8 bg-white rounded-md border"
                    />
                </div>
                <div>
                     <Label>Tanggal Selesai</Label>
                     <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        className="p-0 [&_td]:w-8 [&_td]:h-8 [&_th]:w-8 bg-white rounded-md border"
                    />
                </div>
                 <div>
                    <Button onClick={handleFilter} className="w-full" disabled={loading}>
                        {loading ? 'Memfilter...' : 'Terapkan Filter'}
                    </Button>
                </div>
            </div>

            <div className="mt-6">
                 <div className="overflow-x-auto bg-white border border-zinc-200 rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-zinc-50">
                                <TableHead>#</TableHead>
                                <TableHead>Nama Alat</TableHead>
                                <TableHead>Waktu</TableHead>
                                <TableHead>RPM</TableHead>
                                <TableHead>Berat (kg)</TableHead>
                                <TableHead>Daya (W)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">Loading data...</TableCell>
                                </TableRow>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.alat}</TableCell>
                                        <TableCell>{row.timestamp}</TableCell>
                                        <TableCell>{row.rpm}</TableCell>
                                        <TableCell>{row.berat}</TableCell>
                                        <TableCell>{row.watt}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                 <TableRow>
                                    <TableCell colSpan={6} className="text-center">Tidak ada data untuk filter yang dipilih.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
