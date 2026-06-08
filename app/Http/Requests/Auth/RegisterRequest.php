<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'umur'     => ['nullable', 'integer', 'min:1', 'max:120'],
            'kelamin'  => ['nullable', 'string', 'in:Laki-laki,Perempuan'],
            'jenjang_pendidikan' => ['nullable', 'string'],
            'status_pekerjaan'   => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'name.max' => 'Nama tidak boleh lebih dari 255 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal terdiri dari 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'umur.integer' => 'Umur harus berupa angka.',
            'umur.min' => 'Umur minimal 1 tahun.',
            'umur.max' => 'Umur maksimal 120 tahun.',
            'kelamin.in' => 'Jenis kelamin harus Laki-laki atau Perempuan.',
        ];
    }
}
