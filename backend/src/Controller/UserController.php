<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Event;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserController extends AbstractController
{
    private EmailService $emailService;

    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

    // Send token for public event
    #[Route('api/user/email', name: 'app_user_create', methods: ['POST'])]
    public function createUserWithEmail(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $eventId = $data['eventId'] ?? null;

        if (!$email || !$eventId) {
            return new JsonResponse(['error' => 'Email et ID de l\'événement sont requis.'], 400);
        }

        // Rechercher l'utilisateur par email
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if (!$user) {
            $user = new User();
            $user->setEmail($email);
        } else {
            // Vérifier si l'utilisateur est déjà inscrit à cet événement
            $event = $entityManager->getRepository(Event::class)->find($eventId);
            if ($event && $event->getUsers()->contains($user)) {
                return new JsonResponse(['error' => 'already registered'], 400);
            }
        }

        // Générer un token de vérification
        $token = Uuid::v4()->toRfc4122(); // Génération de token (UUID)
        $user->setVerificationToken($token);

        // Définir la date d'expiration du token
        $expiryDate = new \DateTime('+10 minutes');
        $user->setTokenExpiry($expiryDate);

        // Envoyer l'email de vérification
        try {
            $this->emailService->sendVerificationEmail($email, $token, $eventId);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Impossible d\'envoyer l\'email : ' . $e->getMessage()], 500);
        }

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur créé et email de vérification envoyé.'], 201);
    }

    // Invite friend with mail
    #[Route('/api/invite', name: 'invite_friend', methods: ['POST'])]
    public function inviteFriend(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $friendEmail = $data['email'] ?? null;

        if (!$friendEmail) {
            return new JsonResponse(['error' => 'L\'adresse e-mail est requise.'], 400);
        }

        // Vérifier si l'utilisateur existe déjà
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $friendEmail]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'Cet utilisateur est déjà inscrit.'], 400);
        }


        // Envoyer l'e-mail d'invitation
        try {
            $this->emailService->sendInvitationEmail($friendEmail);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Impossible d\'envoyer l\'invitation : ' . $e->getMessage()], 500);
        }

        return new JsonResponse(['message' => 'Invitation envoyée avec succès.'], 201);
    }

    // Verify email for public event
    #[Route('/api/verify-email/{token}/{id}', name: 'verify_email', methods: ['GET'])]
    public function verifyEmail(string $token, int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Rechercher l'utilisateur par token
        $user = $entityManager->getRepository(User::class)->findOneBy(['verificationToken' => $token]);

        if (!$user) {
            return new JsonResponse(['error' => 'Token invalide ou déjà utilisé.'], 400);
        }

        // Vérifier si le token a expiré
        if ($user->getTokenExpiry() < new \DateTime()) {
            return new JsonResponse(['error' => 'Token expiré.'], 400);
        }

        // Rechercher l'événement par ID
        $event = $entityManager->getRepository(Event::class)->find($id);
        if (!$event) {
            return new JsonResponse(['error' => 'Événement introuvable.'], 404);
        }

        // Vérifier si l'utilisateur est déjà inscrit à l'événement
        if ($event->getUsers()->contains($user)) {
            return new JsonResponse(['message' => 'Utilisateur déjà inscrit à l\'événement.'], 200);
        }

        // Ajouter l'utilisateur à l'événement
        $event->addUser($user);
        $user->addEvent($event);

        // Supprimer le token après l'inscription
        $user->setVerificationToken(null);
        $user->setTokenExpiry(null);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur inscrit à l\'événement avec succès.'], 200);
    }

    // Send token for account creation
    #[Route('api/user/register', name: 'app_user_register', methods: ['POST'])]
    public function registerEmail(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        if(empty($email)){
            return new JsonResponse(['error' => 'Email est requis.'], 400);
        }

        // Vérifier si l'utilisateur existe déjà
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if($existingUser->getVerificationToken() !== null){
            $user = $existingUser;
        }
        else{
            $firstName = $data['firstName'] ?? null;
            $lastName = $data['lastName'] ?? null;
            $plainPassword = $data['plainPassword'] ?? null;

            if (empty($firstName) || empty($lastName) || empty($plainPassword)) {
                return new JsonResponse(['error' => 'Informations incomplètes'], 400);
            }

            $user = new User();
            $user->setEmail($email);
            $user->setFirstName($firstName);
            $user->setLastName($lastName);
    
            // Hasher le mot de passe
            $password = $passwordHasher->hashPassword($user, $plainPassword);
            $user->setPassword($password);
        }

        // Générer un token de vérification
        $token = Uuid::v4()->toRfc4122(); // Génération de token (UUID)
        $user->setVerificationToken($token);

        // Définir la date d'expiration du token
        $expiryDate = new \DateTime('+10 minutes');
        $user->setTokenExpiry($expiryDate);

        // Désactiver l'utilisateur par défaut
        $user->setActive(false);

        $entityManager->persist($user);
        $entityManager->flush();

        // Envoyer l'email de vérification
        try {
            $this->emailService->sendRegisterEmail($email, $token);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Impossible d\'envoyer l\'email : ' . $e->getMessage()], 500);
        }

        return new JsonResponse(['message' => 'Utilisateur créé et email de vérification envoyé.'], 201);
    }
    
    #[Route('/api/verify-email-register/{token}', name: 'verify_email_register', methods: ['GET'])]
    public function verifyEmailRegister(string $token, int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Rechercher l'utilisateur par token
        $user = $entityManager->getRepository(User::class)->findOneBy(['verificationToken' => $token]);

        if (!$user) {
            return new JsonResponse(['error' => 'Token invalide ou déjà utilisé.'], 400);
        }

        // Vérifier si le token a expiré
        if ($user->getTokenExpiry() < new \DateTime()) {
            return new JsonResponse(['error' => 'Token expiré.'], 400);
        }

        // Supprimer le token après l'inscription
        $user->setVerificationToken(null);
        $user->setTokenExpiry(null);
        $user->setActive(true);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur inscrit avec succès.'], 200);
    }
}
