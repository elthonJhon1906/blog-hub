<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("CREATE TYPE blog_status_enum AS ENUM ('draft','published','archived')");

        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users','id');
            $table->string('title', 100);
            $table->text('content');
            $table->string('thumbnail_url');
            $table->enum('status', ['draft','published','archived'])->default('draft');
            $table->foreignId('category_id')->constrained('categories','id');
            $table->integer('views')->default(0);
            $table->integer('likes')->default(0);
            $table->timestamps()->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->softDeletes('deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
