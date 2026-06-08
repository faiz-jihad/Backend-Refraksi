<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'questionnaire_link',
                'value' => 'https://docs.google.com/forms/d/e/1FAIpQLSfCZgxzNRaoZv5U6QIKx_xUoBk4ekO69EcjKIIiPxxdxCyqtg/viewform',
                'group' => 'general',
            ],
            [
                'key' => 'app_name',
                'value' => 'MataCeria',
                'group' => 'general',
            ],
        ];

        foreach ($settings as $s) {
            Setting::updateOrCreate(['key' => $s['key']], $s);
        }
    }
}
