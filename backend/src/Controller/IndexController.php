<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


class IndexController extends AbstractController
{
    #[Route('/index', name: 'app_index')]
    public function index(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): Response
    {
        // Créer un nouvel utilisateur
        $user = new User();
        $user->setEmail('johndoe');
        $user->setPassword($passwordHasher->hashPassword($user, 'test'));
        $user->setRoles(['ROLE_USER']);

        // Persister l'utilisateur dans la base de données
        $entityManager->persist($user);
        $entityManager->flush();

        return new Response('Nouvel utilisateur créé avec succès');
    }
}
