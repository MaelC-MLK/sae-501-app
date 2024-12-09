<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Psr\Log\LoggerInterface;

class RefreshTokenMiddleware
{
    private JWTTokenManagerInterface $jwtManager;
    private UserProviderInterface $userProvider;
    private LoggerInterface $logger;

    public function __construct(JWTTokenManagerInterface $jwtManager, UserProviderInterface $userProvider, LoggerInterface $logger)
    {
        $this->jwtManager = $jwtManager;
        $this->userProvider = $userProvider;
        $this->logger = $logger;
    }

    public function onKernelResponse(ResponseEvent $event)
    {
        $request = $event->getRequest();
        $jwt = $request->cookies->get('eventify');

        if (!$jwt) {
            return;
        }

        try {
            // Decode et valide le JWT
            $payload = $this->jwtManager->parse($jwt);
        } catch (\Exception $e) {
            $response = new Response('Error on token:' . $e, 403);
            $event->setResponse($response);
    
            return;
        }

        $user = null;

        if(!empty($payload['username'])){
            $user = $this->userProvider->loadUserByIdentifier($payload['username']);
        }
        else {
            return;
        }

        if (!$user) {
            return;
        }

        if($user->isActive() == false){
            $response = $event->getResponse();
            $response->headers->clearCookie('eventify');

            return;
        }

        if($user->getLogout()){
            $tokenIssuedAtDateTime = (new \DateTime())->setTimestamp($payload['iat']);
            if($user->getLogout()->getTimestamp() >  $tokenIssuedAtDateTime->getTimestamp()){
                $response = $event->getResponse();
                $response->headers->clearCookie('eventify');
    
                return;
            }
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
