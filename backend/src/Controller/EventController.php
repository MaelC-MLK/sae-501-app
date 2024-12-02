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

    #[Route('/api/events/invite', name: 'invite_to_event', methods: ['POST'])]
    public function inviteToEvent(Request $request, EntityManagerInterface $entityManager, MailerInterface $mailer): JsonResponse
    {
        $email = $request->get('email');
        $eventId = $request->get('eventId');

        if (!$email || !$eventId) {
            return new JsonResponse(['message' => 'Email et eventId requis.'], 400);
        }

        $event = $entityManager->getRepository(Event::class)->find($eventId);

        if (!$event) {
            return new JsonResponse(['message' => "Événement introuvable."], 404);
        }

        $link = 'https://www.eventify.com/register?eventId=' . $eventId;
        $emailMessage = (new Email())
            ->from('no-reply@eventify.com')
            ->to($email)
            ->subject('Invitation à l\'événement : ' . $event->getTitle())
            ->html("<p>Vous êtes invité à l'événement <strong>{$event->getTitle()}</strong>.</p>
                    <p>Cliquez <a href='{$link}'>ici</a> pour vous inscrire.</p>");

        try {
            $mailer->send($emailMessage);
            return new JsonResponse(['message' => 'Invitation envoyée avec succès.']);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Erreur lors de l\'envoi de l\'invitation.', 'error' => $e->getMessage()], 500);
        }
    }
}
