<?php

namespace App\DataTransformer;

use ApiPlatform\Core\DataTransformer\DataTransformerInterface;
use App\Entity\Event;

class LimitDataTransformer implements DataTransformerInterface
{
    public function transform($data, string $to, array $context = [])
    {
        if (isset($data['limit']) && is_string($data['limit'])) {
            $data['limit'] = (int) $data['limit'];
        }

        return $data;
    }

    public function supportsTransformation($data, string $to, array $context = []): bool
    {
        return $data instanceof Event;
    }
}