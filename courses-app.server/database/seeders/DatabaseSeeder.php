<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Professor;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user1 = User::factory()->create([
            'name' => 'Emilija Lakinska',
            'email' => 'emilija.lakinska@students.finki.ukim.mk',
            'password' => Hash::make('testtest'),
            'role' => 'student',
        ]);

        $user2 = User::factory()->create([
            'name' => 'Matej Gadjovski',
            'email' => 'matej.gadjovski@students.finki.ukim.mk',
            'password' => Hash::make('testtest'),
            'role' => 'student',
        ]);

        $user3 = User::factory()->create([
            'name' => 'Ivan Chorbev',
            'email' => 'ivan.chorbev@professors.finki.ukim.mk',
            'password' => Hash::make('testtest'),
            'role' => 'professor',
        ]);

        Student::factory()->create([
            'user_id' => $user1->id,
            'name'     => 'Emilija',
            'surname'  => 'Lakinska',
            'index'    => '211123',
        ]);
        
        Student::factory()->create([
            'user_id' => $user2->id,
            'name'     => 'Matej',
            'surname'  => 'Gadjovski',
            'index'    => '211124',
        ]);

        Professor::factory()->create([
            'user_id' => $user3->id,
            'name'     => 'Ivan',
            'surname'  => 'Chorbev',
        ]);
    }
}
