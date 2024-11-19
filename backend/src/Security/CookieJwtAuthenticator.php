<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class CookieJwtAuthenticator extends AbstractAuthenticator
{
    private JWTTokenManagerInterface $jwtTokenManager;
    private UserProviderInterface $userProvider;

    public function __construct(JWTTokenManagerInterface $jwtTokenManager, UserProviderInterface $userProvider)
    {
        $this->jwtTokenManager = $jwtTokenManager;
        $this->userProvider = $userProvider;
    }

    public function supports(Request $request): ?bool
    {
        // Vérifie si le cookie "TOKEN" existe
        return $request->cookies->has('TOKEN');
    }

    public function authenticate(Request $request): SelfValidatingPassport
    {
        

        $jwt = $request->cookies->get('TOKEN');

        if (!$jwt) {
            throw new AuthenticationException('No JWT provided in the cookie.');
        }

        try {
            // Decode et valide le JWT
            $payload = $this->jwtTokenManager->parse($jwt);
        } catch (\Exception $e) {
            throw new AuthenticationException('Invalid JWT token.', 0, $e);
        }

        // Utilisez UserBadge pour rechercher l'utilisateur à partir du payload
        return new SelfValidatingPassport(
            new UserBadge($payload['username'] ?? '', function ($userIdentifier){
                // Vous pouvez ici personnaliser comment l'utilisateur est récupéré
                // Par exemple, charger l'utilisateur depuis la base de données
                $user = $this->userProvider->loadUserByIdentifier($userIdentifier);
                return $user;
            })
        );
    }

    public function onAuthenticationSuccess(Request $request, $passport, string $firewallName): ?Response
    {
        // Authentification réussie : pas de réponse spécifique nécessaire
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new Response('Authentication failed: ' . $exception->getMessage(), Response::HTTP_UNAUTHORIZED);
    }
}
