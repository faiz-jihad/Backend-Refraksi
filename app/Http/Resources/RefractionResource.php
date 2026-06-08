<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RefractionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $ai = $this->ai_recommendations ?? [];
        
        return [
            'id'              => $this->id,
            'predicted_class' => $ai['predicted_class'] ?? $ai['condition_category'] ?? 'Normal',
            'confidence'      => $ai['confidence'] ?? 1.0,
            'visual_acuity'   => $this->visual_acuity,
            'snellen_decimal' => $ai['snellen_decimal'] ?? null,
            'recommendation'  => $ai['recommendation'] ?? $ai['kondisi'] ?? null,
            'friendly_summary' => $ai['friendly_summary'] ?? null,
            'action_required' => $ai['action_required'] ?? (($ai['predicted_class'] ?? 'Normal') !== 'Normal'),
            'image_url'       => $this->image_path ? '/storage/' . $this->image_path : null,
            'created_at'      => $this->created_at->toISOString(),
            'results'         => [
                'predicted_class' => $ai['predicted_class'] ?? $ai['condition_category'] ?? 'Normal',
                'visual_acuity'   => $this->visual_acuity,
                'snellen_decimal' => $ai['snellen_decimal'] ?? null,
                'recommendation'  => $ai['recommendation'] ?? $ai['kondisi'] ?? null,
                'friendly_summary' => $ai['friendly_summary'] ?? null,
                'action_required' => $ai['action_required'] ?? (($ai['predicted_class'] ?? 'Normal') !== 'Normal'),
            ]
        ];
    }
}
