<?php
// src/EventListener/RateLimiterEventListener.php
namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Security\Core\User\UserProviderInterface;

/**
 * L'attribut permet de déclarer la méthode onRequest 
 * comme un event listener sur l'event RequestEvent (kernel.request)
 **/
#[AsEventListener(RequestEvent::class, 'onRequest')]
#[AsEventListener(ResponseEvent::class, 'onResponse')]
final readonly class RateLimiterEventListener
{
    private RateLimiterFactory $anonymousApiLimiter;
    private RateLimiterFactory $authenticatedApiLimiter;
    private JWTTokenManagerInterface $jwtTokenManager;
    private UserProviderInterface $userProvider;

    public function __construct(
        RateLimiterFactory $anonymousApiLimiter,
        RateLimiterFactory $authenticatedApiLimiter,
        JWTTokenManagerInterface $jwtTokenManager,
        UserProviderInterface $userProvider
    ) {
        $this->anonymousApiLimiter = $anonymousApiLimiter;
        $this->authenticatedApiLimiter = $authenticatedApiLimiter;
        $this->jwtTokenManager = $jwtTokenManager;
        $this->userProvider = $userProvider;
    }

    public function onRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $jwt = $request->cookies->get('eventify');

        if (!$jwt) {
            $limiter = $this->anonymousApiLimiter->create(
                $event->getRequest()->getClientIp()
            );
        } else {
            try {
                // Decode et valide le JWT
                $payload = $this->jwtTokenManager->parse($jwt);
            } catch (\Exception $e) {
                throw new AuthenticationException('Invalid JWT token.', 0, $e);
            }

            if(!empty($payload['username'])){
                $user = $this->userProvider->loadUserByIdentifier($payload['username']);
    
                if (!$user) {
                    $limiter = $this->anonymousApiLimiter->create(
                        $event->getRequest()->getClientIp()
                    );
                } else {
                    $limiter = $this->authenticatedApiLimiter->create (
                        $event->getRequest()->getClientIp()
                    );
                }
            }
        }
        

        $limit = $limiter->consume(1);

        if (!$limit->isAccepted()) {
            $event->setResponse(
                new Response(status: Response::HTTP_TOO_MANY_REQUESTS)
            );
        }
    }

    public function onResponse(ResponseEvent $event): void
    {
        $request = $event->getRequest();
        $jwt = $request->cookies->get('eventify');

        if (!$jwt) {
            $limiter = $this->anonymousApiLimiter->create(
                $event->getRequest()->getClientIp()
            );
        } else {
            try {
                // Decode et valide le JWT
                $payload = $this->jwtTokenManager->parse($jwt);
            } catch (\Exception $e) {
                throw new AuthenticationException('Invalid JWT token.', 0, $e);
            }

            if(!empty($payload['username'])){
                $user = $this->userProvider->loadUserByIdentifier($payload['username']);
    
                if (!$user) {
                    $limiter = $this->anonymousApiLimiter->create(
                        $event->getRequest()->getClientIp()
                    );
                } else {
                    $limiter = $this->authenticatedApiLimiter->create (
                        $event->getRequest()->getClientIp()
                    );
                }
            }
        }
        
        $limit = $limiter->consume(match ($event->getResponse()->getStatusCode()) {
            Response::HTTP_NOT_FOUND => 5,
            Response::HTTP_FORBIDDEN, Response::HTTP_METHOD_NOT_ALLOWED, Response::HTTP_BAD_REQUEST => 10,         
            Response::HTTP_UNAUTHORIZED => 100,
            default => 0,
        });
    }
}