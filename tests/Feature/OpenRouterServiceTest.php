<?php

namespace Tests\Feature;

use App\Services\AI\OpenRouterService;
use App\Exceptions\GeminiException;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class OpenRouterServiceTest extends TestCase
{
    private OpenRouterService $service;

    protected function setUp(): void
    {
        parent::setUp();
        // Ensure configuration is set for tests
        config(['services.openrouter.api_key' => 'test-api-key']);
        config(['services.openrouter.model' => 'test/primary-model']);
        config(['services.openrouter.fallback_enabled' => true]);

        $this->service = new OpenRouterService();
    }

    /**
     * Test that OpenRouterService can be correctly instantiated.
     */
    public function test_service_configuration_loads_correctly(): void
    {
        $this->assertInstanceOf(OpenRouterService::class, $this->service);
    }

    /**
     * Test that OpenRouterService successfully parses a clean JSON response.
     */
    public function test_successful_structured_analysis_with_direct_json(): void
    {
        Http::fake([
            'openrouter.ai/api/v1/chat/completions' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'predicted_class' => 'Rabun Jauh',
                                'confidence' => 0.85,
                                'visual_acuity' => '20/40',
                                'recommendation' => 'Gunakan kacamata minus.',
                                'friendly_summary' => 'Anda terindikasi rabun jauh.',
                                'action_required' => true,
                            ])
                        ]
                    ]
                ]
            ], 200)
        ]);

        $refractionData = [
            'right_eye_sphere' => -1.25,
            'left_eye_sphere' => -1.25,
            'visual_acuity' => '20/40'
        ];

        $result = $this->service->analyzeRefraction($refractionData);

        $this->assertEquals('Rabun Jauh', $result['predicted_class']);
        $this->assertEquals(0.85, $result['confidence']);
        $this->assertTrue($result['action_required']);
    }

    /**
     * Test that OpenRouterService successfully parses JSON wrapped in markdown code blocks.
     */
    public function test_json_extraction_from_markdown(): void
    {
        Http::fake([
            'openrouter.ai/api/v1/chat/completions' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => "Berikut adalah hasilnya:\n```json\n{\n  \"predicted_class\": \"Rabun Dekat\",\n  \"confidence\": 0.90\n}\n```\nSemoga membantu!"
                        ]
                    ]
                ]
            ], 200)
        ]);

        $snellenData = [
            'smallest_row_read' => 20,
            'smallest_n_point' => 10,
            'test_type' => 'near'
        ];

        $result = $this->service->analyzeSnellen($snellenData);

        $this->assertEquals('Rabun Dekat', $result['predicted_class']);
        $this->assertEquals(0.90, $result['confidence']);
        $this->assertEquals('Rabun Dekat', $result['predicted_class']);
    }

    /**
     * Test that OpenRouterService handles rate limit (429) by skipping the failing model
     * and trying the fallback models in sequence immediately.
     */
    public function test_rate_limit_triggers_immediate_fallback_to_next_models(): void
    {
        Http::fake([
            'openrouter.ai/api/v1/chat/completions' => Http::sequence()
                // Primary model hits rate limit (429)
                ->push(['error' => 'Rate limit exceeded'], 429)
                // Second model (fallback 1) succeeds
                ->push([
                    'choices' => [
                        [
                            'message' => [
                                'content' => json_encode([
                                    'predicted_class' => 'Silinder',
                                    'confidence' => 0.75,
                                    'recommendation' => 'Gunakan lensa silinder.'
                                    ])
                            ]
                        ]
                    ]
                ], 200)
        ]);

        $refractionData = [
            'right_eye_sphere' => 0,
            'left_eye_sphere' => 0,
            'visual_acuity' => '20/20'
        ];

        $result = $this->service->analyzeRefraction($refractionData);

        $this->assertEquals('Silinder', $result['predicted_class']);
        $this->assertEquals(0.75, $result['confidence']);
        
        // Assert that two HTTP requests were made (one for primary, one for fallback)
        Http::assertSentCount(2);
    }

    /**
     * Test that when JSON parsing completely fails on malformed non-JSON text,
     * the service drops to buildTextFallbackResponse and extracts fields via regex.
     */
    public function test_text_based_fallback_parsing_on_malformed_json(): void
    {
        Http::fake([
            'openrouter.ai/api/v1/chat/completions' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => "Hasil analisis: Pasien mengalami rabun jauh (miopi). Rekomendasi: Disarankan memakai kacamata lensa minus. Friendly_summary: Anda terindikasi mengalami rabun jauh."
                        ]
                    ]
                ]
            ], 200)
        ]);

        $refractionData = [
            'right_eye_sphere' => -2.00,
            'left_eye_sphere' => -2.00,
            'visual_acuity' => '20/60'
        ];

        $result = $this->service->analyzeRefraction($refractionData);

        $this->assertEquals('Rabun Jauh', $result['predicted_class']);
        $this->assertEquals('Disarankan memakai kacamata lensa minus.', $result['recommendation']);
        $this->assertEquals('Anda terindikasi mengalami rabun jauh.', $result['friendly_summary']);
        $this->assertTrue($result['is_fallback']);
    }

    /**
     * Test that when JSON parsing fails due to truncation at the very beginning,
     * the service generates a clean structured default recommendation instead of leaking raw keys.
     */
    public function test_fallback_handles_truncated_json_without_leaking_keys(): void
    {
        Http::fake([
            'openrouter.ai/api/v1/chat/completions' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => "{\n  \"predicted_class\": \"Rabun Jauh\""
                        ]
                    ]
                ]
            ], 200)
        ]);

        $refractionData = [
            'right_eye_sphere' => -2.00,
            'left_eye_sphere' => -2.00,
            'visual_acuity' => '20/60'
        ];

        $result = $this->service->analyzeRefraction($refractionData);

        $this->assertEquals('Rabun Jauh', $result['predicted_class']);
        // The recommendation must not leak JSON keys or structure
        $this->assertStringNotContainsString('predicted_class', $result['recommendation']);
        $this->assertStringNotContainsString('confidence', $result['recommendation']);
        $this->assertStringContainsString('Hasil skrining menunjukkan adanya indikasi Rabun Jauh (Miopi).', $result['recommendation']);
        $this->assertTrue($result['is_fallback']);
    }

    /**
     * Test that the chat method returns the correct text content from a mocked OpenRouter API.
     */
    public function test_chat_method_succeeds_with_mocked_response(): void
    {
        Http::fake([
            'openrouter.ai/api/v1/chat/completions' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'role' => 'assistant',
                            'content' => 'Halo Kak! Saya MataCeria AI. Tips menjaga kesehatan mata adalah ikuti aturan 20-20-20.'
                        ]
                    ]
                ],
                'usage' => [
                    'total_tokens' => 45
                ]
            ], 200)
        ]);

        $response = $this->service->chat("Halo! Berikan tips menjaga kesehatan mata.");

        $this->assertStringContainsString('MataCeria AI', $response);
        $this->assertStringContainsString('20-20-20', $response);
    }
}


