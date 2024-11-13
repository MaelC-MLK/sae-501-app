<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class LogoutController extends AbstractController
{
    private $refreshTokenManager;
    private $entityManager;

    public function __construct(RefreshTokenManagerInterface $refreshTokenManager, EntityManagerInterface $entityManager)
    {
        $this->refreshTokenManager = $refreshTokenManager;
        $this->entityManager = $entityManager;
    }


    #[Route('/api/token/invalidate', name: 'invalidate_refresh_token', methods: ['POST'])]
    public function invalidate(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $refreshToken = $data['refresh_token'] ?? null;

        if (!$refreshToken) {
            return new JsonResponse(['error' => 'Refresh token is required'], 400);
        }

        $refreshTokenEntity = $this->refreshTokenManager->get($refreshToken);

        if (!$refreshTokenEntity) {
            return new JsonResponse(['error' => 'Invalid refresh token'], 400);
        }

        $this->entityManager->remove($refreshTokenEntity);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Refresh token invalidated'], 200);
    }
}