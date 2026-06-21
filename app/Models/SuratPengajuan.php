<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuratPengajuan extends Model
{
    use HasFactory;
    protected $table = 'surat_pengajuan';
    protected $fillable = [
        'user_id',
        'jenis_surat_id',
        'nomor_surat',
        'lampiran',
        'tujuan',
        'kota',
        'perihal',
        'tanggal_acara',
        'isi_surat',
        'lampiran',
        'status',
        'catatan_sekretaris',
        'file_pdf',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jenisSurat()
    {
        return $this->belongsTo(JenisSurat::class);
    }

    public function tandaTangan()
    {
        return $this->hasMany(SuratTandaTangan::class)->orderBy('urutan');
    }
}