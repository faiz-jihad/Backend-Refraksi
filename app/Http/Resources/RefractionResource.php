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
        
        $predictedClass = $ai['predicted_class'] ?? $ai['condition_category'] ?? $ai['kategori'] ?? 'Normal';
        $recommendation = $ai['recommendation'] ?? $ai['kondisi'] ?? $ai['description'] ?? null;
        $actionRequired = $ai['action_required'] ?? ($predictedClass !== 'Normal');

        return [
            'id'              => $this->id,
            'predicted_class' => $predictedClass,
            'confidence'      => $ai['confidence'] ?? 1.0,
            'visual_acuity'   => $this->visual_acuity,
            'snellen_decimal' => $ai['snellen_decimal'] ?? null,
            'recommendation'  => $recommendation,
            'friendly_summary' => $ai['friendly_summary'] ?? null,
            'action_required' => $actionRequired,
            'image_url'       => $this->image_path ? '/storage/' . $this->image_path : null,
            'created_at'      => $this->created_at ? $this->created_at->toIso8601String() : null,
            'results'         => [
                'predicted_class' => $predictedClass,
                'visual_acuity'   => $this->visual_acuity,
                'snellen_decimal' => $ai['snellen_decimal'] ?? null,
                'recommendation'  => $recommendation,
                'friendly_summary' => $ai['friendly_summary'] ?? null,
                'action_required' => $actionRequired,
            ]
        ];
    }
}
