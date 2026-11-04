<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique(); // 'KJV', 'RCPV', 'NIV', 'NLT'
            $table->string('name', 100);
            $table->string('language', 10)->default('en');
            $table->string('language_name', 50);
            $table->boolean('is_public_domain')->default(false);
            $table->string('copyright_notice')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};
