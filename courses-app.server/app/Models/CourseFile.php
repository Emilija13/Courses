<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CourseFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'filename',
        'filepath',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
