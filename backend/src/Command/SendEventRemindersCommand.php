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
            ->setName(self::$defaultName)
            ->setDescription('Envoie des rappels pour les événements à venir');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $now = new \DateTime();
        $tomorrow = (clone $now)->modify('+1 day');

        $startOfDay = (clone $tomorrow)->setTime(0, 0, 0);
        $endOfDay = (clone $tomorrow)->setTime(23, 59, 59);

        $io->text(sprintf('Date de début : %s', $startOfDay->format('Y-m-d H:i:s')));
        $io->text(sprintf('Date de fin : %s', $endOfDay->format('Y-m-d H:i:s')));

        $events = $this->entityManager->getRepository(Event::class)->createQueryBuilder('e')
            ->where('e.date_start BETWEEN :start AND :end')
            ->setParameter('start', $startOfDay)
            ->setParameter('end', $endOfDay)
            ->getQuery()
            ->getResult();

        if (empty($events)) {
            $io->warning('Aucun événement trouvé pour demain.');
            return Command::SUCCESS;
        }

        foreach ($events as $event) {
            $io->text(sprintf('Événement trouvé : ID %d, Date de début : %s', $event->getId(), $event->getDateStart()->format('Y-m-d H:i:s')));
            $users = $event->getUsers();
            if (empty($users)) {
                $io->warning(sprintf('Aucun utilisateur trouvé pour l\'événement ID %d.', $event->getId()));
                continue;
            }

            foreach ($users as $user) {
                $this->emailService->sendEventReminderEmail($user->getEmail(), $event);
                $io->text(sprintf('Email envoyé à %s pour l\'événement ID %d.', $user->getEmail(), $event->getId()));
            }
        }

        $io->success('Les rappels ont été envoyés avec succès.');

        return Command::SUCCESS;
    }
}