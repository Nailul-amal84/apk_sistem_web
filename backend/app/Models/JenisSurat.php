<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JenisSurat extends Model
{
    use HasFactory;
    protected $table = 'jenis_surat';
    protected $fillable = [
        'nama_surat',
        'kode',
    ];

    public function suratPengajuan()
    {
        return $this->hasMany(SuratPengajuan::class);
    }
}