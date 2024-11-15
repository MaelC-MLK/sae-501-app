<?php
// src/EventListener/JWTCreatedListener.php
namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $user = $event->getUser();
        $payload = $event->getData();

        // Ajoutez le champ 'sub' avec l'ID de l'utilisateur
        $payload['sub'] = $user->getId();

        $event->setData($payload);
    }
}