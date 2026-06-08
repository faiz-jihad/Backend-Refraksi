<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RefractionResult extends Model
{
    protected $fillable = [
        'user_id',
        'right_eye_sphere',
        'left_eye_sphere',
        'right_eye_cylinder',
        'left_eye_cylinder',
        'visual_acuity',
        'ai_recommendations',
    ];

    protected $casts = [
        'right_eye_sphere'   => 'float',
        'left_eye_sphere'    => 'float',
        'right_eye_cylinder' => 'float',
        'left_eye_cylinder'  => 'float',
        'ai_recommendations' => 'array',
        'created_at'         => 'datetime',
        'updated_at'         => 'datetime',
    ];

    // Relasi
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
