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

    public function sendVerificationEmail(string $recipientEmail, string $eventId, int $userId ): void
    {
        $verificationLink = sprintf('%s/verify-email/%s/%d', $_ENV['APP_FRONT_BASE_URL'],  $eventId, $userId);
        $unregisterLink = sprintf('%s/unregister/%s/%d', $_ENV['APP_FRONT_BASE_URL'], $eventId, $userId);

        // Rendre le template Twig
        $htmlContent = $this->twig->render('emails/verification_email.html.twig', [
            'verification_link' => $verificationLink,
            'unregister_link'=> $unregisterLink
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
        $verificationLink = sprintf('%s/register/verify/%s', $_ENV['APP_FRONT_BASE_URL'], $token);

        // Rendre le template Twig
        $htmlContent = $this->twig->render('emails/verification_email_register.html.twig', [
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
        $invitationLink = $_ENV['APP_FRONT_BASE_URL'] . '/register';
    
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

    public function sendInvitationEvent(string $recipientEmail, string $eventTitle, string $eventLink): void
    {
        // Rendre le template Twig avec les informations spécifiques à l'événement
        $htmlContent = $this->twig->render('emails/invitation_email_event.html.twig', [
            'event_title' => $eventTitle,
            'event_link' => $eventLink,
        ]);

        $email = (new Email())
            ->from('eventifyverif.noreply@gmail.com')
            ->to($recipientEmail)
            ->subject('Invitation à l\'événement : ' . $eventTitle)
            ->html($htmlContent);

        $this->mailer->send($email);
    }
    
    

    public function sendEventUpdateEmail(string $recipientEmail, $event): void
    {
        $htmlContent = $this->twig->render('emails/event_update_email.html.twig', [
            'event' => $event,
        ]);

        $email = (new Email())
            ->from('eventifyverif.noreply@gmail.com')
            ->to($recipientEmail)
            ->subject('Mise à jour de l\'événement')
            ->html($htmlContent);

        $this->mailer->send($email);
    }

    public function sendEventDeleteEmail(string $recipientEmail, $event): void
    {
        $htmlContent = $this->twig->render('emails/event_delete_email.html.twig', [
            'event' => $event,
        ]);

        $email = (new Email())
            ->from('eventifyverif.noreply@gmail.com')
            ->to($recipientEmail)
            ->subject('Suppression de l\'événement')
            ->html($htmlContent);

        $this->mailer->send($email);
    }

    public function sendEventReminderEmail(string $recipientEmail, $event): void
    {
        $htmlContent = $this->twig->render('emails/event_reminder_email.html.twig', [
            'event' => $event,
        ]);

        $email = (new Email())
        ->from('eventifyverif.noreply@gmail.com')
        ->to($recipientEmail)
        ->subject('Rappel de l\'événement')
        ->html($htmlContent);

        $this->mailer->send($email);
    }

    public function sendEventCreateEmail(string $recipientEmail, $event): void
    {
        $htmlContent = $this->twig->render('emails/event_create_email.html.twig', [
            'event' => $event,
        ]);

        $email = (new Email())
            ->from('eventifyverif.noreply@gmail.com')
            ->to($recipientEmail)
            ->subject('Création de l\'événement')
            ->html($htmlContent);

        $this->mailer->send($email);
    }

    public function sendResetPasswordEmail(string $recipientEmail, string $token): void
    {
        $resetLink = sprintf('%s/forgot-password/%s', $_ENV['APP_FRONT_BASE_URL'], $token);

            // Rendre le template Twig
            $htmlContent = $this->twig->render('emails/reset_password.html.twig', [
                'reset_link' => $resetLink,
            ]);
    
            $email = (new Email())
                ->from('eventifyverif.noreply@gmail.com')
                ->to($recipientEmail)
                ->subject('Reinitialisation de votre mot de passe')
                ->html($htmlContent);
    
            $this->mailer->send($email);
    }
}