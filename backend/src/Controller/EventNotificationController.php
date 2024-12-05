<?php

namespace App\Controller;

use App\Entity\Event;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class EventNotificationController extends AbstractController
{
    private $emailService;

    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

    #[Route('/api/events/{id}/notify-update', name: 'event_notify_update', methods: ['POST'])]
    public function notifyUpdate(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $event = $entityManager->getRepository(Event::class)->find($id);
        if (!$event) {
            return new JsonResponse(['message' => 'Événement non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $users = $event->getUsers();
        foreach ($users as $user) {
            $this->emailService->sendEventUpdateEmail($user->getEmail(), $event);
        }

        return new JsonResponse(['message' => 'Emails de mise à jour envoyés avec succès.'], JsonResponse::HTTP_OK);
    }

    #[Route('/api/events/{id}/notify-delete', name: 'event_notify_delete', methods: ['POST'])]
    public function notifyDelete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $event = $entityManager->getRepository(Event::class)->find($id);
        if (!$event) {
            return new JsonResponse(['message' => 'Événement non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $users = $event->getUsers();
        foreach ($users as $user) {
            $this->emailService->sendEventDeleteEmail($user->getEmail(), $event);
        }

        return new JsonResponse(['message' => 'Emails de suppression envoyés avec succès.'], JsonResponse::HTTP_OK);
    }

    #[Route('/api/events/{id}/notify-create', name: 'event_notify_create', methods: ['POST'])]
    public function notifyCreate(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $event = $entityManager->getRepository(Event::class)->find($id);
        if (!$event) {
            return new JsonResponse(['message' => 'Événement non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $users = $event->getUsers();
        foreach ($users as $user) {
            $this->emailService->sendEventCreateEmail($user->getEmail(), $event);
        }

        return new JsonResponse(['message' => 'Emails de création envoyés avec succès.'], JsonResponse::HTTP_OK);
    }
}