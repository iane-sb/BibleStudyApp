<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('verses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('translation_id')->constrained('translations')->cascadeOnDelete();
            $table->foreignId('book_id')->constrained('books')->cascadeOnDelete();
            $table->foreignId('chapter_id')->constrained('chapters')->cascadeOnDelete();
            $table->unsignedSmallInteger('chapter_number');
            $table->unsignedSmallInteger('verse_number');
            $table->text('verse_text');
            $table->timestamps();

            // Composite index for fast chapter reads
            $table->unique(
                ['translation_id', 'book_id', 'chapter_number', 'verse_number'],
                'idx_verses_lookup'
            );

            // Fulltext index for scripture search (supported in MySQL/MariaDB)
            if (\Illuminate\Support\Facades\DB::getDriverName() !== 'sqlite') {
                $table->fullText('verse_text');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verses');
    }
};
