<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


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
}