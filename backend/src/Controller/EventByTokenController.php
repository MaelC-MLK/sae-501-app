<?php
namespace App\Controller;

use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class EventByTokenController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function __invoke(string $idToken): Response
    {
        $event = $this->entityManager->getRepository(Event::class)->findOneBy(['idToken' => $idToken]);
        
        if (!$event) {
            throw new NotFoundHttpException('Event not found.');
        }

         return new Response(json_encode([
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
            'idToken' => $event->getIdToken(),
            'limit' => $event->getLimit(),
            'users' => $event->getUsers()->map(function ($user) {
                return [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'avatar' => $user->getAvatar(),
                ];
            })->toArray(),
        ]));
    }
}
