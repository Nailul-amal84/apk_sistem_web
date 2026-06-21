<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfilController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'nullable|string|max:30',
        ]);

        $user = $request->user();
        $user->update([
            'name' => $request->name,
            'nim' => $request->nim,
        ]);

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user' => $user,
        ]);
    }
}