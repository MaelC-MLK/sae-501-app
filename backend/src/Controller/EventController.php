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
        // Récupérer le paramètre de la requête
        $isPublic = $request->query->get('is_visible');

        // Construire les critères pour trouver les événements
        $criteria = [];
        if ($isPublic) {
            $criteria['isVisible'] = filter_var($isPublic, FILTER_VALIDATE_BOOLEAN);
        }

        // Récupérer les événements selon les critères
        $events = $entityManager->getRepository(Event::class)->findBy($criteria);

        // Normaliser les résultats pour un retour JSON correct
        $data = array_map(function (Event $event) {
            return [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'date_start' => $event->getDateStart()->format('d/m/Y - H:i'),
                'date_end' => $event->getDateEnd()->format('d/m/Y - H:i'),
                'isVisible' => $event->isIsVisible(),
                'state' => $event->getState(),
            ];
        }, $events);

        return new JsonResponse($data);
    }
}
