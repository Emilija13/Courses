<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $data = $request->validated();
        
        $user = \App\Models\User::where('email', $data['email'])->first();

        if (!$user) {
            return response([
                'message' => 'Email not found'
            ], 422);
        }

        if (!Hash::check($data['password'], $user->password)) {
            return response([
                'message' => 'Incorrect password'
            ], 422);
        }

        // if(!Auth::attempt($data)){
        //     return response([
        //         'message' => 'email or password are wrong'
        //     ]);
        // }
        //$user = Auth::user();
        Auth::login($user);

        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->currentAccessToken()->delete();
            return response('', 204);
        }

    return response(['error' => 'Not authenticated'], 401);
    }
}
