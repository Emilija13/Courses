<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = Student::all();
        return response()->json($students);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'index' => 'required|string|unique:students,index',
        ]);

        $student = Student::create($validated);
        return response()->json($student, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        return response()->json($student);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'index' => 'required|string|unique:students,index,' . $student->id,
        ]);

        $student->update($validated);

        return response()->json($student, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(null, 204);
    }

    /**
     * Display all courses for student
     */

    public function courses($userId)
    {
        $student = Student::where('user_id', $userId)->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $courses = $student->courses()->with(['professor', 'files'])->get()->makeHidden('pivot');

        return response()->json($courses);
    }
}
