<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class JenisSurat
{
/**
     * Mengambil seluruh dataset template surat dari GitHub
     */
    public function getAllTemplates(): array
    {
        $githubUrl = "https://raw.githubusercontent.com/Arif-al-farisi/sample-data-sistem-web/refs/heads/main/sample-data.json";

        try {
            // Mengambil data menggunakan HTTP Client Laravel
            $response = Http::get($githubUrl);

            if ($response->failed()) {
                return [];
            }

            return $response->json() ?? [];
        } catch (\Exception $e) {
            // Jika koneksi bermasalah, kembalikan array kosong
            return [];
        }
    }

    /**
     * Mencari satu template surat spesifik berdasarkan kode jenis surat
     */
    public function getTemplateByKode(string $kode): ?array
    {
        $datasets = $this->getAllTemplates();

        // Cari data yang kodenya cocok (case-insensitive menggunakan strtoupper)
        $matched = collect($datasets)->firstWhere('kode', strtoupper($kode));

        return $matched ?? null;
    }
}
