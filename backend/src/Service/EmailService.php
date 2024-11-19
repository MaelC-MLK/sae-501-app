<?php

namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class EmailService
{
    private MailerInterface $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function sendVerificationEmail(string $recipientEmail, string $token, int $eventId): void
    {
        $verificationLink = sprintf('http://localhost:8090/verify-email/%s/%d', $token, $eventId);

        $email = (new Email())
            ->from('eventifyverif.noreply@gmail.com')
            ->to($recipientEmail)
            ->subject('Vérification de votre inscription')
            ->text(sprintf(
                'Cliquez sur le lien suivant pour vérifier votre email : %s',
                $verificationLink
            ));

        $this->mailer->send($email);
    }
}
