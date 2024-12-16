<?php
namespace App\Controller;

use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UpdateEventImageController extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $event = $entityManager->getRepository(Event::class)->find($id);

        if (!$event) {
            return new JsonResponse(['error' => 'Evenement non trouvé'], 404);
        }

        $imageFile = $request->files->get('imageFile');
        if ($imageFile) {
            $event->setImageFile($imageFile);
            $event->setImage($imageFile->getClientOriginalName());
            $event->setImageSize($imageFile->getSize());
            $entityManager->flush();
        }

        return new JsonResponse(['status' => 'Image mise à jour avec succès']);
    }
}