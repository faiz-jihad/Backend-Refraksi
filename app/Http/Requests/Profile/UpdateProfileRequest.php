<?php

declare(strict_types=1);

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = auth()->id() ?? 0;

        return [
            'name'            => ['nullable', 'string', 'max:255'],
            'email'           => ['nullable', 'string', 'email', 'max:255', 'unique:users,email,' . $userId],
            'phone'           => ['nullable', 'string', 'max:20'],
            'umur'            => ['nullable', 'integer', 'min:0', 'max:150'],
            'kelamin'         => ['nullable', 'string', 'max:20'],
            'vision_type'     => ['nullable', 'string', 'max:255'],
            'allergies'       => ['nullable', 'string', 'max:255'],
            'medical_history' => ['nullable', 'string'],
        ];
    }
}
