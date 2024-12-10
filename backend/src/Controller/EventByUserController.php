<?php

namespace App\Controller;

use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class EventByUserController extends AbstractController
{ 
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function __invoke(Request $request, int $userId): JsonResponse
    {
        // Utilisez une requête DQL pour récupérer les événements
        $query = $this->entityManager->createQuery(
            'SELECT e
            FROM App\Entity\Event e
            JOIN e.users u
            WHERE u.id = :userId AND e.is_draft = :isDraft AND e.date_start > :dateStart AND e.supprime IS NULL' 
        )->setParameters([
            'userId' => $userId,
            'isDraft' => 0,
            'dateStart' => new \DateTime(),
        ]);

        $events = $query->getResult();

        $data = array_map(function (Event $event) {
            return [
                'id' => $event->getId(),
                'creator_id' => $event->getCreator()->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'date_start' => $event->getDateStart()->format('d/m/Y - H:i'),
                'date_end' => $event->getDateEnd()->format('d/m/Y - H:i'),
                'isVisible' => $event->isIsVisible(),
                'image' => $event->getImage(),
                'location' => $event->getLocation(),
                'users' => array_map(function ($user) {
                    return [
                        'id' => $user->getId(),
                        'email' => $user->getEmail(),
                        'firstname' => $user->getFirstname(),
                        'lastname' => $user->getLastname(),
                        'avatar' => $user->getAvatar(),
                    ];
                }, $event->getUsers()->toArray()),
            ];
        }, $events);

        return new JsonResponse($data);
    }
}