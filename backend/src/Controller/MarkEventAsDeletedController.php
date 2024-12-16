<?php

namespace App\Controller;

use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class MarkEventAsDeletedController extends AbstractController
{
    #[Route('/api/events/{id}/delete', name: 'event_mark_as_deleted', methods: ['PATCH'])]
    public function __invoke(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $event = $entityManager->getRepository(Event::class)->find($id);

        if (!$event) {
            return new JsonResponse(['message' => 'Événement non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $event->markAsDeleted();
        $entityManager->flush();

        return new JsonResponse(['message' => 'Événement marqué comme supprimé.'], JsonResponse::HTTP_OK);
    }
}