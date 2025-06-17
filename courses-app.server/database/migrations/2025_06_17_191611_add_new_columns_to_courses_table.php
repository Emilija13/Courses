<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
        $table->enum('category', ['computer-science', 'mathematics', 'physics', 'chemistry', 'biology', 'literature'])->after('name');    
        $table->text('description')->after('category'); 
        $table->integer('duration')->after('description'); 
        $table->enum('level', ['beginner', 'intermediate', 'advanced'])->after('duration');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['category', 'description', 'duration', 'level']);
        });
    }
};
