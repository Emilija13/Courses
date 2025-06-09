<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\ProfessorController;
use App\Http\Controllers\Api\CourseController;

Route::apiResource('students', StudentController::class);
Route::get('students/{student}/courses', [StudentController::class, 'courses']);

Route::apiResource('professors', ProfessorController::class);

Route::apiResource('courses', CourseController::class);
Route::post('courses/{course}/add-student', [CourseController::class, 'addStudent']);