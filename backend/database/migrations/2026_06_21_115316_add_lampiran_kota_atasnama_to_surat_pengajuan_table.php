<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('surat_pengajuan', function (Blueprint $table) {
            $table->string('lampiran')->nullable()->after('nomor_surat');
            $table->string('kota')->default('Banda Aceh')->after('tujuan');
            $table->string('atas_nama')->nullable()->after('isi_surat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surat_pengajuan', function (Blueprint $table) {
            $table->dropColumn(['lampiran', 'kota', 'atas_nama']);
        });
    }
};
