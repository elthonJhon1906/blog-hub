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
         Schema::create('blog_likes', function (Blueprint $table) {
            $table->foreignId('blog_id')->constrained('blogs','id');
            $table->foreignId('user_id')->constrained('users','id');
            $table->timestamps();
            $table->primary(['blog_id','user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_likes');
    }
};
