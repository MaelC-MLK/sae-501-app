<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;


class EventController extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $criteria = ['isVisible' => true];
        $events = $entityManager->getRepository(Event::class)->findBy($criteria);

        $data = array_map(function (Event $event) {
            return [
                'id' => $event->getId(),
                'creator' => [
                    'id' => $event->getCreator()->getId(),
                    'email' => $event->getCreator()->getEmail(),
                    'firstName' => $event->getCreator()->getFirstName(),
                    'lastName' => $event->getCreator()->getLastName(),
                    'avatar' => $event->getCreator()->getAvatar(),
                ],
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'date_start' => $event->getDateStart()->format('d/m/Y - H:i'),
                'date_end' => $event->getDateEnd()->format('d/m/Y - H:i'),
                'isVisible' => $event->isIsVisible(),
                'image' => $event->getImage(),
                'location' => $event->getLocation(),
                'isRecommended' => $event->isRecommended(),
                'users' => $event->getUsers()->map(function ($user) {
                    return [
                        'id' => $user->getId(),
                        'email' => $user->getEmail(),
                        'firstName' => $user->getFirstName(),
                        'lastName' => $user->getLastName(),
                        'avatar' => $user->getAvatar(),
                    ];
                })->toArray(),
            ];
        }, $events);

        return new JsonResponse($data);
    }

    #[Route('/api/events/{id}/join', name: 'event_join', methods: ['PATCH'])]
    public function joinEvent(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['message' => 'Vous devez être connecté pour vous inscrire.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Récupérer l'événement par ID
        $event = $entityManager->getRepository(Event::class)->find($id);
        if (!$event) {
            return new JsonResponse(['message' => 'Événement non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Vérifier si l'utilisateur est déjà inscrit
        if ($event->getUsers()->contains($user)) {
            return new JsonResponse(['message' => 'Vous êtes déjà inscrit à cet événement.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Ajouter l'utilisateur à l'événement
        $event->addUser($user);
        $entityManager->persist($event);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Inscription réussie à l\'événement.'], JsonResponse::HTTP_OK);
    }

    #[Route('/api/events/{id}/is-registered', name: 'event_is_registered', methods: ['GET'])]
    public function isRegistered(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['isRegistered' => false], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Récupérer l'événement par ID
        $event = $entityManager->getRepository(Event::class)->find($id);
        if (!$event) {
            return new JsonResponse(['isRegistered' => false], JsonResponse::HTTP_NOT_FOUND);
        }

        // Vérifier si l'utilisateur est déjà inscrit
        $isRegistered = $event->getUsers()->contains($user);

        return new JsonResponse(['isRegistered' => $isRegistered], JsonResponse::HTTP_OK);
    }

    #[Route('/api/events/{id}/unregister', name: 'event_unregister', methods: ['PATCH'])]
    public function unregisterEvent(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['message' => 'Vous devez être connecté pour vous désinscrire.'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Récupérer l'événement par ID
        $event = $entityManager->getRepository(Event::class)->find($id);
        if (!$event) {
            return new JsonResponse(['message' => 'Événement non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Vérifier si l'utilisateur est inscrit
        if (!$event->getUsers()->contains($user)) {
            return new JsonResponse(['message' => 'Vous n\'êtes pas inscrit à cet événement.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Supprimer l'utilisateur de l'événement
        $event->removeUser($user);
        $entityManager->persist($event);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Désinscription réussie de l\'événement.'], JsonResponse::HTTP_OK);
    }
}