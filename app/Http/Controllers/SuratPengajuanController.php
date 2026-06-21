<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SuratPengajuan;
use Barryvdh\DomPDF\Facade\Pdf;

class SuratPengajuanController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'jenis_surat_id' => 'required|exists:jenis_surat,id',
            'lampiran' => 'nullable|string|max:100',
            'tujuan' => 'required|string|max:255',
            'kota' => 'nullable|string|max:100',
            'perihal' => 'required|string|max:255',
            'tanggal_acara' => 'nullable|date',
            'isi_surat' => 'required|string',
            'atas_nama' => 'nullable|string|max:255',
            'tanda_tangan' => 'required|array|min:1|max:4',
            'tanda_tangan.*.nama' => 'required|string|max:255',
            'tanda_tangan.*.jabatan' => 'required|string|max:255',
        ]);

        $surat = SuratPengajuan::create([
            'user_id' => $request->user()->id,
            'jenis_surat_id' => $request->jenis_surat_id,
            'lampiran' => $request->lampiran,
            'tujuan' => $request->tujuan,
            'kota' => $request->kota ?? 'Banda Aceh',
            'perihal' => $request->perihal,
            'tanggal_acara' => $request->tanggal_acara,
            'isi_surat' => $request->isi_surat,
            'atas_nama' => $request->atas_nama,
            'status' => 'pending',
        ]);

        foreach ($request->tanda_tangan as $index => $ttd) {
            $surat->tandaTangan()->create([
                'nama' => $ttd['nama'],
                'jabatan' => $ttd['jabatan'],
                'urutan' => $index + 1,
            ]);
        }

        return response()->json([
            'message' => 'Pengajuan surat berhasil dikirim',
            'data' => $surat->load('tandaTangan'),
        ], 201);
    }

    public function riwayat(Request $request)
    {
        $surat = SuratPengajuan::with('jenisSurat')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($surat);
    }


    public function semuaPengajuan()
    {
        $surat = SuratPengajuan::with(['user', 'jenisSurat'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($surat);
    }

    public function approve(Request $request, $id)
    {
        $surat = SuratPengajuan::findOrFail($id);

        $nomorUrut = SuratPengajuan::where('jenis_surat_id', $surat->jenis_surat_id)
            ->where('status', 'disetujui')
            ->count() + 1;

        $bulanRomawi = $this->bulanRomawi(now()->month);
        $kodeJenis = $surat->jenisSurat->kode;
        $tahun = now()->year;

        $nomorSurat = sprintf('%03d/%s/%s/%s', $nomorUrut, $kodeJenis, $bulanRomawi, $tahun);

        $surat->update([
            'status' => 'disetujui',
            'nomor_surat' => $nomorSurat,
        ]);

        return response()->json([
            'message' => 'Surat berhasil disetujui',
            'data' => $surat,
        ]);
    }

    public function tolak(Request $request, $id)
    {
        $request->validate([
            'catatan_sekretaris' => 'required|string',
        ]);

        $surat = SuratPengajuan::findOrFail($id);

        $surat->update([
            'status' => 'ditolak',
            'catatan_sekretaris' => $request->catatan_sekretaris,
        ]);

        return response()->json([
            'message' => 'Surat ditolak',
            'data' => $surat,
        ]);
    }

    private function bulanRomawi($bulan)
    {
        $romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        return $romawi[$bulan - 1];
    }
    public function downloadPdf(Request $request, $id)
    {
        $surat = SuratPengajuan::with(['tandaTangan', 'jenisSurat'])->findOrFail($id);

        if ($surat->status !== 'disetujui') {
            return response()->json([
                'message' => 'Surat belum disetujui, PDF belum bisa diunduh.',
            ], 403);
        }

        $user = $request->user();
        if ($user->role !== 'sekretaris' && $surat->user_id !== $user->id) {
            return response()->json([
                'message' => 'Akses ditolak.',
            ], 403);
        }

        $pdf = Pdf::loadView('pdf.surat', compact('surat'));

        $namaFile = str_replace('/', '-', $surat->nomor_surat);

        return $pdf->download('Surat-' . $namaFile . '.pdf');
    }
    public function laporan()
    {
        $total = SuratPengajuan::count();
        $pending = SuratPengajuan::where('status', 'pending')->count();
        $disetujui = SuratPengajuan::where('status', 'disetujui')->count();
        $ditolak = SuratPengajuan::where('status', 'ditolak')->count();

        $perJenis = SuratPengajuan::selectRaw('jenis_surat_id, count(*) as jumlah')
            ->with('jenisSurat:id,nama_surat')
            ->groupBy('jenis_surat_id')
            ->get()
            ->map(function ($item) {
                return [
                    'nama_surat' => $item->jenisSurat->nama_surat,
                    'jumlah' => $item->jumlah,
                ];
            });

        return response()->json([
            'total' => $total,
            'pending' => $pending,
            'disetujui' => $disetujui,
            'ditolak' => $ditolak,
            'per_jenis' => $perJenis,
        ]);
    }
}