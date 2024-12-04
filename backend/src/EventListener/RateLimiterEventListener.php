<?php
// src/EventListener/RateLimiterEventListener.php
namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Bundle\SecurityBundle\Security;

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
    private Security $security;

    public function __construct(
        RateLimiterFactory $anonymousApiLimiter,
        RateLimiterFactory $authenticatedApiLimiter,
        Security $security
    ) {
        $this->anonymousApiLimiter = $anonymousApiLimiter;
        $this->authenticatedApiLimiter = $authenticatedApiLimiter;
        $this->security = $security;
    }

    public function onRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $user = $this->security->getUser();

        if (!$user) {
            $limiter = $this->anonymousApiLimiter->create(
                $event->getRequest()->getClientIp()
            );
        } else {
            $limiter = $this->authenticatedApiLimiter->create (
                $event->getRequest()->getClientIp()
            );
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
        $user = $this->security->getUser();
        
        if (!$user) {
            $limiter = $this->anonymousApiLimiter->create(
                $event->getRequest()->getClientIp()
            );
        } else {
            $limiter = $this->authenticatedApiLimiter->create (
                $event->getRequest()->getClientIp()
            );
        }

        $limit = $limiter->consume(match ($event->getResponse()->getStatusCode()) {
            Response::HTTP_NOT_FOUND => 5,
            Response::HTTP_FORBIDDEN, Response::HTTP_METHOD_NOT_ALLOWED, Response::HTTP_BAD_REQUEST => 10,         
            Response::HTTP_UNAUTHORIZED => 100,
            default => 0,
        });
    }
}