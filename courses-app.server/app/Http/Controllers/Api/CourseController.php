<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::with('professor')->get();
        return response()->json($courses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|in:computer-science,mathematics,physics,chemistry,biology,literature',
                'description' => 'required|string',
                'duration' => 'required|integer|min:1|max:52',
                'level' => 'required|in:beginner,intermediate,advanced',
            ]);

            $user = auth()->user();
            $professor = $user->professor;

            $course = Course::create([
                'professor_id' => $professor->id,
                'name' => $validated['name'],
                'category' => $validated['category'],
                'description' => $validated['description'],
                'duration' => $validated['duration'],
                'level' => $validated['level'],
                'students_count' => 0,
            ]);

            return response()->json([
                'message' => 'Course created successfully.',
                'data' => $course
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Internal Server Error',
                'exception' => $e->getMessage(),
                'trace' => $e->getTrace(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        $course->load('professor'); 
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
        return response()->json(null, 204);
    }

    /**
     * Attach a student to a course.
     */
    public function addStudent(Request $request, Course $course)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
        ]);

        if ($course->students()->where('student_id', $validated['student_id'])->exists()) {
            return response()->json(['message' => 'Student already attached to this course.'], 409);
        }

        $course->students()->attach($validated['student_id']);
        $course->students_count = $course->students()->count();
        $course->save();

        return response()->json([
            'message' => "Student attached to course successfully.",
            'course_id' => $course->id,
            'student_id' => $validated['student_id']
        ], 200);
    }

    public function students($id)
    {
        $course = Course::with('students')->findOrFail($id);
        return response()->json($course->students);
    }
}
