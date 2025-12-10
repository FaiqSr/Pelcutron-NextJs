'use client';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

const mockHistory = [
    { id: 1, alat: 'Alat 1', timestamp: '2024-05-21 10:00:00', rpm: 800, berat: 50, watt: 120 },
    { id: 2, alat: 'Alat 1', timestamp: '2024-05-21 10:05:00', rpm: 810, berat: 50.2, watt: 122 },
    { id: 3, alat: 'Alat 2', timestamp: '2024-05-21 11:00:00', rpm: 1000, berat: 75, watt: 150 },
];

export default function HistoryPage() {
    const [selectedAlat, setSelectedAlat] = useState('');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());
    const [filteredData, setFilteredData] = useState(mockHistory);

    const handleFilter = () => {
        // Filtering logic would go here
        alert('Filtering data (logic not implemented)');
    }

    return (
        <div>
            <h1 className="text-lg sm:text-xl font-semibold">Histori Data</h1>
            
            <div className="mt-6 p-4 border rounded-lg bg-zinc-50 grid md:grid-cols-4 gap-4 items-end">
                <div>
                    <Label htmlFor="alatSelect">Pilih Alat</Label>
                    <Select onValueChange={setSelectedAlat}>
                        <SelectTrigger id="alatSelect">
                            <SelectValue placeholder="Semua Alat" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Alat</SelectItem>
                            <SelectItem value="1">Alat 1</SelectItem>
                            <SelectItem value="2">Alat 2</SelectItem>
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
                    <Button onClick={handleFilter} className="w-full">Terapkan Filter</Button>
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
                            {filteredData.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.alat}</TableCell>
                                    <TableCell>{row.timestamp}</TableCell>
                                    <TableCell>{row.rpm}</TableCell>
                                    <TableCell>{row.berat}</TableCell>
                                    <TableCell>{row.watt}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
