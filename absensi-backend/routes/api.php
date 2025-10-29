<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Absensi routes
    Route::prefix('absensi')->group(function () {
        Route::post('/check-in', [AbsensiController::class, 'checkIn']);
        Route::post('/check-out', [AbsensiController::class, 'checkOut']);
        Route::get('/history', [AbsensiController::class, 'history']);
        Route::get('/today', [AbsensiController::class, 'today']);
        Route::get('/summary', [AbsensiController::class, 'summary']);
    });

    Route::apiResource('employees', EmployeeController::class);
    Route::get('/absensi/report', [AbsensiController::class, 'report']);
});