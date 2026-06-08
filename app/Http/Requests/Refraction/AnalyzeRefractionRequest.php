<?php

declare(strict_types=1);

namespace App\Http\Requests\Refraction;

use Illuminate\Foundation\Http\FormRequest;

class AnalyzeRefractionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Auth sudah ditangani middleware
    }

    public function rules(): array
    {
        return [
            // Manual Input Format
            'right_eye_sphere'   => ['nullable', 'required_without:snellen_data', 'numeric', 'between:-20,20'],
            'left_eye_sphere'    => ['nullable', 'required_without:snellen_data', 'numeric', 'between:-20,20'],
            'right_eye_cylinder' => ['nullable', 'numeric', 'between:-10,10'],
            'left_eye_cylinder'  => ['nullable', 'numeric', 'between:-10,10'],
            'visual_acuity'      => ['nullable', 'required_without:snellen_data', 'string'],
            
            // AI Snellen Test Format (from Flutter AIRefractionTestScreen)
            'snellen_data'       => ['nullable', 'array'],
            'image'              => ['nullable', 'string'], // base64 eye crop
            'screen_ppi'         => ['nullable', 'numeric'],
            'user_id'            => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'right_eye_sphere.required' => 'Data bola mata kanan wajib diisi',
            'visual_acuity.in'          => 'Format ketajaman visual tidak valid',
        ];
    }
}
