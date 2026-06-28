<?php

namespace App\Http\Controllers;

use App\Services\JenisSurat as jenisSuratService; // ini service ynag kami gunakan
use App\Models\JenisSurat;

class JenisSuratController extends Controller
{
    protected  jenisSuratService $jenisSuratService ;

// Inject service ke dalam constructor controller
    public function __construct(jenisSuratService $jenisSuratService)
    {
        $this->jenisSuratService = $jenisSuratService;
    }


    public function index()
    {
        $jenisSurat = JenisSurat::all();

        return response()->json($jenisSurat);
    }

/**
     * Di sini kami mengguanakn nya sebagai template halaman
     */
public function template()
    {
        // Panggil method dari Service Class
        $templateData = $this->jenisSuratService->getAllTemplates();

        if (!$templateData) {
            return response()->json([
                'status' => 'error',
                'message' => 'gagall mengambil jenis surat'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $templateData
        ], 200);
    }
}
