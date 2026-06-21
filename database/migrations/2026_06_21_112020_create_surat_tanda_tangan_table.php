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
        Schema::create('surat_tanda_tangan', function (Blueprint $table) {
            $table->id();
             $table->foreignId('surat_pengajuan_id')->constrained('surat_pengajuan')->onDelete('cascade');
            $table->string('nama');
            $table->string('jabatan');
            $table->integer('urutan')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_tanda_tangan');
    }
};
