<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    #[Route('api/user/email', name: 'app_user_create', methods: ['POST'])]
    public function createUserWithEmail(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $eventId = $data['eventId'] ?? null; // Assurez-vous que l'ID de l'événement est envoyé dans la requête

        if (!$email || !$eventId) {
            return new JsonResponse(['error' => $email. $eventId], 400);
        }

        // Créer l'utilisateur s'il n'existe pas déjà
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if (!$user) {
            $user = new User();
            $user->setEmail($email);
        }
        
        else{
            $eventsUser = $user->getEvents();
            foreach ($eventsUser as $eventUser){
                if($eventUser->getId() == $eventId){
                    return new JsonResponse(['error' => "already registered"], 400);
                }
            }
        }


        // Ajouter l'utilisateur à la table event_user
        $event = $entityManager->getRepository(Event::class)->find($eventId);
        $event->addUser($user);
        $user->addEvent($event);

        $entityManager->persist($user);
        $entityManager->persist($event);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur créé et ajouté à l\'événement.'], 201);
    }
}

