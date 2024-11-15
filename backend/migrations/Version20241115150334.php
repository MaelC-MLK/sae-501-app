<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241115150334 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event ADD image_size INT DEFAULT NULL, ADD updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', CHANGE is_visible is_visible VARCHAR(1) NOT NULL, CHANGE image image VARCHAR(255) DEFAULT NULL, CHANGE is_draft is_draft VARCHAR(1) NOT NULL');
        $this->addSql('ALTER TABLE user CHANGE plain_password avatar VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `user` CHANGE avatar plain_password VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE event DROP image_size, DROP updated_at, CHANGE is_visible is_visible TINYINT(1) NOT NULL, CHANGE image image VARCHAR(5) DEFAULT NULL, CHANGE is_draft is_draft TINYINT(1) NOT NULL');
    }
}
