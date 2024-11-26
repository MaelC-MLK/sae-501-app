<?php

namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class EmailService
{
    private MailerInterface $mailer;
    private Environment $twig;

    public function __construct(MailerInterface $mailer, Environment $twig)
    {
        $this->mailer = $mailer;
        $this->twig = $twig;
    }

    public function sendVerificationEmail(string $recipientEmail, string $token, int $eventId): void
    {
        $verificationLink = sprintf('http://localhost:8090/verify-email/%s/%d', $token, $eventId);

        // Rendre le template Twig
        $htmlContent = $this->twig->render('emails/verification_email.html.twig', [
            'verification_link' => $verificationLink,
        ]);

        $email = (new Email())
            ->from('eventifyverif.noreply@gmail.com')
            ->to($recipientEmail)
            ->subject('Vérification de votre inscription')
            ->html($htmlContent);

        $this->mailer->send($email);
    }

    public function sendRegisterEmail(string $recipientEmail, string $token): void
    {
        $verificationLink = sprintf('http://localhost:8090/verify-email/%s', $token);

        // Rendre le template Twig
        $htmlContent = $this->twig->render('emails/verification_email.html.twig', [
            'verification_link' => $verificationLink,
        ]);

        $email = (new Email())
            ->from('eventifyverif.noreply@gmail.com')
            ->to($recipientEmail)
            ->subject('Vérification de votre inscription')
            ->html($htmlContent);

        $this->mailer->send($email);
    }

    public function sendInvitationEmail(string $recipientEmail): void
    {
        // URL statique pour l'inscription
        $invitationLink = 'http://localhost:8090/register';
    
        // Rendre le template Twig
        $htmlContent = $this->twig->render('emails/invitation_email.html.twig', [
            'invitation_link' => $invitationLink,
        ]);
    
        $email = (new Email())
            ->from('eventifyverif.noreply@gmail.com')
            ->to($recipientEmail)
            ->subject('Invitation à rejoindre Eventify')
            ->html($htmlContent);
    
        $this->mailer->send($email);
    }
    




}
