<?php

namespace App\Controller;

use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class EventByCreatorController extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $entityManager, int $creatorId): JsonResponse
    {
        // Ajoutez la condition is_draft = 0 dans les critères de recherche
        $criteria = ['creator' => $creatorId, 'is_draft' => '0'];
        $events = $entityManager->getRepository(Event::class)->findBy($criteria);

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
                'isRecommended' => $event->isRecommended(),
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