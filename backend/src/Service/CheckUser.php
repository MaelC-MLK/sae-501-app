<?php

namespace App\Service;

use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class CheckUser {
    private $jwtTokenManager;
    private $userProvider;

    public function __construct(JWTTokenManagerInterface $jwtTokenManager, UserProviderInterface $userProvider) {
        $this->jwtTokenManager = $jwtTokenManager;
        $this->userProvider = $userProvider;
    }

    public function check(string $jwt): bool
    {
        if (!$jwt) {
            throw new AuthenticationException('No JWT provided in the cookie.');
        }

        try {
            // Decode and validate the JWT
            $payload = $this->jwtTokenManager->parse($jwt);
        } catch (\Exception $e) {
            throw new AuthenticationException('Invalid JWT token.', 0, $e);
        }

        if (!empty($payload['username'])) {
            $user = $this->userProvider->loadUserByIdentifier($payload['username']);

            if (!$user) {
                throw new AuthenticationException('User not found.');
            }

            return true;
        }

        return false;
    }
}