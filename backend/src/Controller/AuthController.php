<?php

namespace App\Controller;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;
use App\Service\EmailService;

class AuthController
{
    private JWTTokenManagerInterface $jwtManager;
    private UserPasswordHasherInterface $passwordHasher;
    private UserProviderInterface $userProvider;
    private EmailService $emailService;

    public function __construct(
        JWTTokenManagerInterface $jwtManager,
        UserPasswordHasherInterface $passwordHasher,
        UserProviderInterface $userProvider,
        EmailService $emailService
    ) {
        $this->jwtManager = $jwtManager;
        $this->passwordHasher = $passwordHasher;
        $this->userProvider = $userProvider;
        $this->emailService = $emailService;
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

        if($user->isActive() === false){
            return new JsonResponse(['error' => 'Your account is not active'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $credentials['password'])) {
            return new JsonResponse(['error' => 'Invalid credentials'], JsonResponse::HTTP_UNAUTHORIZED);
        }


        // Générer un token JWT
        $token = $this->jwtManager->create($user);

        // Créer un cookie pour le token
        $cookie = new Cookie(
            'eventify',          // Nom du cookie
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

    #[Route('/api/auth/me', name: 'api_auth_me', methods: ['POST'])]
    public function authMe (Request $request): JsonResponse
    {
        // Récupérer le token JWT depuis le cookie
        $token = $request->cookies->get('eventify');
        
        if (!$token) {
            return new JsonResponse(['error' => 'Unauthorized'], JsonResponse::HTTP_UNAUTHORIZED);
        }
        
        // Valider le token
        $tokenParsed = $this->jwtManager->parse($token);
        
        if (!$tokenParsed) {
            return new JsonResponse(['error' => 'Unauthorized'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $user = $this->userProvider->loadUserByIdentifier($tokenParsed['username']);

        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        if($user->isActive() === false){
            return new JsonResponse(['error' => 'Your account is not active'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        if($user->getLogout()){
            $tokenIssuedAtDateTime = (new \DateTime())->setTimestamp($tokenParsed['iat']);
            if($user->getLogout()->getTimestamp() >  $tokenIssuedAtDateTime->getTimestamp()){
                return new JsonResponse(['error' => 'You are logged out'], JsonResponse::HTTP_UNAUTHORIZED);
            }
        }

        // Créer une réponse JSON avec les informations de l'utilisateur
        $data = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'avatar' => $user->getAvatar(),
        ];

        // Retourner la réponse
        return new JsonResponse($data);
    }

    #[Route('/api/auth/logout', name: 'api_auth_logout', methods: ['POST'])]
    public function logout(EntityManagerInterface $em, Request $request): JsonResponse
    {

        // Récupérer le token JWT depuis le cookie
        $token = $request->cookies->get('eventify');

        if (!$token) {
            return new JsonResponse(['error' => 'Unauthorized'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Valider le token
        $user = $this->jwtManager->parse($token);

        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $user = $this->userProvider->loadUserByIdentifier($user['username']);

        $user->setLogout(new \DateTime());

        $em->persist($user);
        $em->flush();
        
        // Créer une réponse JSON vide
        $response = new JsonResponse(null);
        $response->headers->clearCookie('eventify');
        
        // Retourner la réponse
        
        return $response;
    }   
    
    // Forgot password
    #[Route('/api/auth/forgot-password', name: 'forgot_password', methods: ['POST'])]
    public function forgotPassword(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        if (!$email) {
            return new JsonResponse(['error' => 'Email est requis.'], 400);
        }

        // Rechercher l'utilisateur par email
        $user = $this->userProvider->loadUserByIdentifier($email);

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur introuvable.'], 404);
        }

        // Générer un token de réinitialisation
        $token = Uuid::v4()->toRfc4122(); // Génération de token (UUID)
        $user->setResetToken($token);

        // Définir la date d'expiration du token
        $expiryDate = new \DateTime('+10 minutes');
        $user->setResetTokenExpiry($expiryDate);

        $entityManager->flush();

        // Envoyer l'email de réinitialisation
        try {
            $this->emailService->sendResetPasswordEmail($email, $token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Impossible d\'envoyer l\'email : ' . $e->getMessage()], 500);
        }

        return new JsonResponse(['message' => 'Email de réinitialisation envoyé.'], 200);
    }

    // Reset password
    #[Route('/api/auth/reset-password/{token}', name: 'reset_password', methods: ['POST'])]
    public function resetPassword(string $token, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {

        if (!$token) {
            return new JsonResponse(['error' => 'Token requis.'], 400);
        }

        // Rechercher l'utilisateur par token
        $user = $entityManager->getRepository(User::class)->findOneBy(['resetToken' => $token]);

        if (!$user) {
            return new JsonResponse(['error' => 'Token invalide ou déjà utilisé.'], 400);
        }

        // Vérifier si le token a expiré
        if ($user->getResetTokenExpiry() < new \DateTime()) {
            return new JsonResponse(['error' => 'Token expiré.'], 400);
        }

        $data = json_decode($request->getContent(), true);
        $password = $data['password'] ?? null;

        if (!$password) {
            return new JsonResponse(['error' => 'Mot de passe requis.'], 400);
        }

        // Vérifier si le token a expiré
        $now = new \DateTime();
        if ($user->getResetTokenExpiry() < $now) {
            return new JsonResponse(['error' => 'Token expiré.'], 400);
        }

        // Réinitialiser le mot de passe
        $user->setPassword($this->passwordHasher->hashPassword($user, $password));
        $user->setResetToken(null);
        $user->setResetTokenExpiry(null);
        // Déconnecter l'utilisateur après la réinitialisation du mot de passe
        $user->setLogout(new \DateTime());

        $entityManager->flush();

        return new JsonResponse(['message' => 'Mot de passe réinitialisé.'], 200);
    }
}