<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JenisSuratController;
use App\Http\Controllers\SuratPengajuanController;
use App\Http\Controllers\ProfilController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/jenis-surat', [JenisSuratController::class, 'index']);
    // halaman yang mengguankan service ini mengirim data ke url /template
    Route::get('/template', [JenisSuratController::class, 'template']);
    Route::post('/surat', [SuratPengajuanController::class, 'store']);
    Route::get('/surat/riwayat', [SuratPengajuanController::class, 'riwayat']);
    Route::get('/surat/{id}/download', [SuratPengajuanController::class, 'downloadPdf']);
    Route::get('/surat/semua', [SuratPengajuanController::class, 'semuaPengajuan'])->middleware('sekretaris');
    Route::put('/surat/{id}/approve', [SuratPengajuanController::class, 'approve'])->middleware('sekretaris');
    Route::put('/surat/{id}/tolak', [SuratPengajuanController::class, 'tolak'])->middleware('sekretaris');
    Route::get('/surat/laporan', [SuratPengajuanController::class, 'laporan'])->middleware('sekretaris');
    Route::get('/profil', [ProfilController::class, 'show']);
    Route::put('/profil', [ProfilController::class, 'update']);
});
