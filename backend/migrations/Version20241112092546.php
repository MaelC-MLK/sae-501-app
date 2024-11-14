<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241112092546 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event ADD image VARCHAR(5) DEFAULT NULL, ADD location VARCHAR(255) DEFAULT NULL, ADD is_draft TINYINT(1) NOT NULL, DROP time_start, DROP time_end');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event ADD time_start TIME NOT NULL, ADD time_end TIME NOT NULL, DROP image, DROP location, DROP is_draft');
    }
}
