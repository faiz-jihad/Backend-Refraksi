<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'    => $this->id,
            'name'  => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'umur'  => $this->umur,
            'kelamin' => $this->kelamin,
            'jenjang_pendidikan' => $this->jenjang_pendidikan,
            'status_pekerjaan' => $this->status_pekerjaan,
            'vision_type' => $this->vision_type,
            'allergies' => $this->allergies,
            'medical_history' => $this->medical_history,
            'profile_picture' => $this->profile_picture,
            'role'  => $this->role,
            'created_at' => $this->created_at ? $this->created_at->toIso8601String() : null,
        ];
    }
}
