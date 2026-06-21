<?php

namespace App\Http\Controllers;

use App\Models\JenisSurat;

class JenisSuratController extends Controller
{
    public function index()
    {
        $jenisSurat = JenisSurat::all();

        return response()->json($jenisSurat);
    }
}