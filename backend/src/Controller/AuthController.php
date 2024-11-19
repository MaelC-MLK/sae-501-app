<?php

namespace App\Controller;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AuthController
{
    private JWTTokenManagerInterface $jwtManager;
    private UserPasswordHasherInterface $passwordHasher;
    private UserProviderInterface $userProvider;

    public function __construct(
        JWTTokenManagerInterface $jwtManager,
        UserPasswordHasherInterface $passwordHasher,
        UserProviderInterface $userProvider
    ) {
        $this->jwtManager = $jwtManager;
        $this->passwordHasher = $passwordHasher;
        $this->userProvider = $userProvider;
    }

    #[Route('/api/auth', name: 'api_auth', methods: ['POST'])]
    public function auth(Request $request): JsonResponse
    {
        // Récupérer les informations d'identification depuis la requête
        $credentials = json_decode($request->getContent(), true);

        if (!$credentials || !isset($credentials['email']) || !isset($credentials['password'])) {
            return new JsonResponse(['error' => 'Invalid credentials'], JsonResponse::HTTP_BAD_REQUEST);
        }


        // Récupérer l'utilisateur par email
        $user = $this->userProvider->loadUserByIdentifier($credentials['email']);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $credentials['password'])) {
            return new JsonResponse(['error' => 'Invalid credentials'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Générer un token JWT
        $token = $this->jwtManager->create($user);

        // Créer un cookie pour le token
        $cookie = new Cookie(
            'TOKEN',          // Nom du cookie
            $token,           // Valeur du cookie (le JWT)
            time() + 3600,    // Expiration (1 heure par exemple)
            '/',              // Chemin d'accès du cookie
            null,             // Domaine du cookie (laisser à null pour le domaine actuel)
            false,             // Le cookie sera accessible uniquement en HTTPS
            true,             // Le cookie est HttpOnly
            false,            // Pas de SameSite strict ici (peut être ajusté selon les besoins)
            'lax'             // Le cookie sera envoyé avec chaque requête
        );

        // Créer une réponse JSON avec les informations de l'utilisateur
        $data = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'avatar' => $user->getAvatar(),
        ];
        
        $response = new JsonResponse($data);

        // Ajouter le cookie à la réponse
        $response->headers->setCookie($cookie);

        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:8090');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        // Retourner la réponse
        return $response;
    }
}