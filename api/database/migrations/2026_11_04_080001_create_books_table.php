<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('book_number')->unique();
            $table->string('code', 10)->unique(); // 'GEN', 'JHN', etc.
            $table->enum('testament', ['OT', 'NT']);
            $table->string('name_en', 50);
            $table->string('name_ceb', 50)->nullable();
            $table->unsignedSmallInteger('total_chapters');
            $table->timestamps();

            $table->index(['testament', 'book_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
