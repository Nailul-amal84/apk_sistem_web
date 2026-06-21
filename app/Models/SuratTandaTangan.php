<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuratTandaTangan extends Model
{
    use HasFactory;

    protected $table = 'surat_tanda_tangan';

    protected $fillable = [
        'surat_pengajuan_id',
        'nama',
        'jabatan',
        'urutan',
    ];

    public function suratPengajuan()
    {
        return $this->belongsTo(SuratPengajuan::class);
    }
}