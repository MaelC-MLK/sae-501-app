<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

class RefreshTokenMiddleware
{
    private JWTTokenManagerInterface $jwtManager;

    public function __construct(JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    public function onKernelResponse(ResponseEvent $event)
    {
        $request = $event->getRequest();
        $user = $request->getUser();

        if (!$user) {
            return;
        }

        // Générer un nouveau token et l'attacher au cookie
        $token = $this->jwtManager->create($user);
        $response = $event->getResponse();

        $response->headers->setCookie(
            new Cookie(
                'refresh',
                $token,
                time() + 3600,
                '/',
                null,
                true,
                true,
                'Strict'
            )
        );
    }
}
