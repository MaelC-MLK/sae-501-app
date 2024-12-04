<?php
// src/Command/SendEventRemindersCommand.php
namespace App\Command;

use App\Entity\Event;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class SendEventRemindersCommand extends Command
{
    protected static $defaultName = 'app:send-event-reminders';
    private $entityManager;
    private $emailService;

    public function __construct(EntityManagerInterface $entityManager, EmailService $emailService)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->emailService = $emailService;
    }

    protected function configure()
    {
        $this
            ->setDescription('Envoie des rappels pour les événements à venir');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $now = new \DateTime();
        $tomorrow = (clone $now)->modify('+1 day');

        $events = $this->entityManager->getRepository(Event::class)->createQueryBuilder('e')
            ->where('e.date_start BETWEEN :start AND :end')
            ->setParameter('start', $tomorrow->setTime(0, 0))
            ->setParameter('end', $tomorrow->setTime(23, 59, 59))
            ->getQuery()
            ->getResult();

        foreach ($events as $event) {
            foreach ($event->getUsers() as $user) {
                $this->emailService->sendEventReminderEmail($user->getEmail(), $event);
            }
        }

        $io->success('Les rappels ont été envoyés avec succès.');

        return Command::SUCCESS;
    }
}