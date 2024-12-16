<?php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UpdateUserImageController extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $imageFile = $request->files->get('imageFile');
        if ($imageFile) {
            $user->setImageFile($imageFile);
            $user->setAvatar($imageFile->getClientOriginalName());
            $user->setImageSize($imageFile->getSize());
            $entityManager->flush();
        }

        return new JsonResponse(['status' => 'Image mise à jour avec succès']);

    }
}