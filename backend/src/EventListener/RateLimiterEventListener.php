<?php
// src/EventListener/RateLimiterEventListener.php
namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Authentication\Token\JWTUserToken;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

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
    private JWTTokenManagerInterface $jwtManager;
    private LoggerInterface $logger;

    public function __construct(
        RateLimiterFactory $anonymousApiLimiter,
        RateLimiterFactory $authenticatedApiLimiter,
        JWTTokenManagerInterface $jwtManager,
        LoggerInterface $logger
    ) {
        $this->anonymousApiLimiter = $anonymousApiLimiter;
        $this->authenticatedApiLimiter = $authenticatedApiLimiter;
        $this->jwtManager = $jwtManager;
        $this->logger = $logger;
    }

    public function onRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $cookies = $request->cookies;

        if (!$cookies->has('eventify')) {
            $this->logger->info('No JWT token found, using anonymous rate limiter.');
            $limiter = $this->anonymousApiLimiter->create(
                $event->getRequest()->getClientIp()
            );
        } else {
            $token = $cookies->get('eventify');
            try {
                $jwtToken = new JWTUserToken();
                $jwtToken->setRawToken($token);
                $user = $this->jwtManager->decode($token);
                $this->logger->info('JWT token found and decoded successfully.');
                $limiter = $this->authenticatedApiLimiter->create(
                    $event->getRequest()->getClientIp()
                );
            } catch (AuthenticationException $e) {
                $this->logger->error('Invalid JWT token.');
                $limiter = $this->anonymousApiLimiter->create(
                    $event->getRequest()->getClientIp()
                );
            }
        }

        $limit = $limiter->consume(1);

        if (!$limit->isAccepted()) {
            $this->logger->warning('Rate limit exceeded.');
            $event->setResponse(
                new Response(status: Response::HTTP_TOO_MANY_REQUESTS)
            );
        } else {
            $this->logger->info('Rate limit check passed.');
        }
    }

    public function onResponse(ResponseEvent $event): void
    {
        $limiter = $this->anonymousApiLimiter->create($event->getRequest()->getClientIp());

        $limit = $limiter->consume(match ($event->getResponse()->getStatusCode()) {
            Response::HTTP_NOT_FOUND => 5,
            Response::HTTP_FORBIDDEN, Response::HTTP_METHOD_NOT_ALLOWED, Response::HTTP_BAD_REQUEST => 10,         
            Response::HTTP_UNAUTHORIZED => 100,
            default => 0,
        });

        $this->logger->info('Response event processed with status code: ' . $event->getResponse()->getStatusCode());
    }
}