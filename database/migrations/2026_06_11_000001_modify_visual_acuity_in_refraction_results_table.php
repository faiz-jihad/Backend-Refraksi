<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('refraction_results', function (Blueprint $table) {
            $table->string('visual_acuity', 50)->change();
        });
    }

    public function down(): void
    {
        Schema::table('refraction_results', function (Blueprint $table) {
            $table->string('visual_acuity', 10)->change();
        });
    }
};
