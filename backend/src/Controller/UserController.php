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

class UserController extends AbstractController
{
    private EmailService $emailService;

    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

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

    #[Route('/api/verify-email/{token}/{id}', name: 'verify_email', methods: ['GET'])]
    public function verifyEmail(string $token, int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Rechercher l'utilisateur par token
        $user = $entityManager->getRepository(User::class)->findOneBy(['verificationToken' => $token]);

        if (!$user) {
            return new JsonResponse(['error' => 'Token invalide ou déjà utilisé.'], 400);
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
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur inscrit à l\'événement avec succès.'], 200);
    }
}
