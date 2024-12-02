<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class RefreshTokenMiddleware
{
    private JWTTokenManagerInterface $jwtManager;
    private LoggerInterface $logger;
    private Security $security;

    public function __construct(JWTTokenManagerInterface $jwtManager, LoggerInterface $logger, Security $security)
    {
        $this->jwtManager = $jwtManager;
        $this->logger = $logger;
        $this->security = $security;
    }

    public function onKernelResponse(ResponseEvent $event)
    {
        $request = $event->getRequest();
        $user = $this->security->getUser();

        if (!$user) {
            return;
        }

        // Générer un nouveau token et l'attacher au cookie
        $token = $this->jwtManager->create($user);
        $response = $event->getResponse();

        $response->headers->setCookie(
            new Cookie(
                'eventify',
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
