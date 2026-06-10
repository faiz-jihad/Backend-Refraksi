<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

class GeminiException extends Exception
{
    /**
     * HTTP status code if applicable.
     *
     * @var int|null
     */
    protected ?int $httpStatusCode;

    /**
     * Additional error context.
     *
     * @var array
     */
    protected array $context;

    /**
     * Create a new GeminiException instance.
     *
     * @param string $message Error message
     * @param int|null $httpStatusCode HTTP status code
     * @param \Throwable|null $previous Previous exception
     * @param array $context Additional context
     */
    public function __construct(
        string $message = '',
        ?int $httpStatusCode = null,
        ?\Throwable $previous = null,
        array $context = []
    ) {
        parent::__construct($message, 0, $previous);
        
        $this->httpStatusCode = $httpStatusCode;
        $this->context = $context;
    }

    /**
     * Get HTTP status code.
     *
     * @return int|null
     */
    public function getHttpStatusCode(): ?int
    {
        return $this->httpStatusCode;
    }

    /**
     * Get error context.
     *
     * @return array
     */
    public function getContext(): array
    {
        return $this->context;
    }

    /**
     * Get user-friendly error message.
     *
     * @return string
     */
    public function getUserMessage(): string
    {
        if (!empty($this->message)) {
            return $this->message;
        }

        return 'Terjadi kesalahan pada layanan AI. Silakan coba lagi nanti.';
    }

    /**
     * Render exception for HTTP response.
     *
     * @return array
     */
    public function render(): array
    {
        return [
            'success' => false,
            'message' => $this->getUserMessage(),
            'error_code' => $this->httpStatusCode ?? 500,
        ];
    }
}