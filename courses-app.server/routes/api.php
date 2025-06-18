<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\ProfessorController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\AuthController;


Route::post('login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::apiResource('students', StudentController::class);
Route::get('students/{student}/courses', [StudentController::class, 'courses']);

Route::apiResource('professors', ProfessorController::class);

Route::middleware('auth:sanctum')->apiResource('courses', CourseController::class);
Route::middleware('auth:sanctum')->post('courses/{course}/add-student', [CourseController::class, 'addStudent']);
Route::middleware('auth:sanctum')->get('/courses/{id}/students', [CourseController::class, 'students']);