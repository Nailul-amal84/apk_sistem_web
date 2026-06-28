<?php

namespace Database\Factories;

use App\Models\JenisSurat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JenisSurat>
 */
class JenisSuratFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
     return [
            // Menggunakan fake data bawaan faker untuk nama teks umum jika dipanggil random
            'nama_surat' => $this->faker->sentence(3),
            'kode' => strtoupper($this->faker->bothify('??-##')), // Contoh hasil: SR-01, AK-12
        ];
    }
}
