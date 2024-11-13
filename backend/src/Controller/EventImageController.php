<?php

namespace App\Controller;

use App\Entity\Event;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Psr\Log\LoggerInterface;

class EventImageController extends AbstractController
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function __invoke(Event $event, Request $request)
    {
        if (!($event instanceof Event)) {
            throw new \RuntimeException('Event attendu');
        }

        $event->setImageFile($request->files->get('file'));
        $event->setUpdatedAt(new \DateTimeImmutable());

        // dd($event);

        // Return a JsonResponse with the event data
        return new JsonResponse([
            'id' => $event->getId(),
            'title' => $event->getTitle(),
            'description' => $event->getDescription(),
            'image' => $event->getImage(),
            'imageFile' => $event->getImageFile(),
        ]);
    }
}