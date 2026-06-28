<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\JenisSurat;

class JenisSuratSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['nama_surat' => 'Surat Tugas', 'kode' => 'ST'],
            ['nama_surat' => 'Surat Undangan', 'kode' => 'SU'],
            ['nama_surat' => 'Surat Peminjaman Barang', 'kode' => 'SPB'],
            ['nama_surat' => 'Surat Permohonan', 'kode' => 'SPM'],
            ['nama_surat' => 'Surat Kepanitiaan', 'kode' => 'SK'],
            ['nama_surat' => 'Surat Keterangan Anggota', 'kode' => 'SKA'],
        ];

        foreach ($data as $item) {
            JenisSurat::create($item);
        }
    }
}