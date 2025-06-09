<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::all();
        return response()->json($courses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'professor_id' => 'required|exists:professors,id',
            'name' => 'required|string|max:255',
        ]);

        $course = Course::create($validated); 
        return response()->json($course, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        return response()->json($course);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'professor_id' => 'required|exists:professors,id',
            'name' => 'required|string|max:255',
        ]);

        $course->update($validated);

        return response()->json($course, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $course->delete();
        return response()->json(null,204); 
    }

    /**
     * Attach a student to a course.
     */
    public function addStudent(Request $request, Course $course)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
        ]);

        if ($course->students()->where('student_id', $validated['student_id'])->exists()) 
        {
            return response()->json(['message' => 'Student already attached to this course.'], 409);
        }

        $course->students()->attach($validated['student_id']);

        return response()->json([
            'message' => "Student attached to course successfully.",
            'course_id' => $course->id,
            'student_id' => $validated['student_id']
        ], 200);
    }
}
