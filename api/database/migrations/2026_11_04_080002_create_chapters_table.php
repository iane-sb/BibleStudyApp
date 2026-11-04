<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('chapters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained('books')->cascadeOnDelete();
            $table->unsignedSmallInteger('chapter_number');
            $table->unsignedSmallInteger('total_verses');
            $table->timestamps();

            $table->unique(['book_id', 'chapter_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chapters');
    }
};
