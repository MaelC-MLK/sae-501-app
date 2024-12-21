-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql
-- Généré le : sam. 21 déc. 2024 à 18:17
-- Version du serveur : 8.4.3
-- Version de PHP : 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `SAE501`
--


--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `roles`, `first_name`, `last_name`, `avatar`, `image_size`, `updated_at`, `verification_token`, `token_expiry`, `logout`, `active`, `reset_token`, `reset_token_expiry`) VALUES
(1, 'tomboutin.tom@gmail.com', '$2y$13$syOMg4qo54jamwzDrBUlSes1e900eIz1M5tj8vOlequ7IwIvq1FLy', '[]', 'Tom', 'Boutin', 'chill-guy-675838aa817be813181962.webp', 8556, '2024-12-10 12:48:42', NULL, NULL, '2024-12-21 16:20:09', 1, NULL, NULL),
(2, 'maelcheron@gmail.com', '$2y$13$4L3WsNMxtzAMdHtlSMESuOa6MIf6mpaO8/7ffXMRFxtlXTkljhBPC', '[]', 'Mael', 'Cheron', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL),
(7, 'test@gmail.com', '$2y$13$4L3WsNMxtzAMdHtlSMESuOa6MIf6mpaO8/7ffXMRFxtlXTkljhBPC', '[]', 'Test', 'Test', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL),
(8, 'user2@gmail.com', '$2y$13$4L3WsNMxtzAMdHtlSMESuOa6MIf6mpaO8/7ffXMRFxtlXTkljhBPC', '[]', 'Prénom', 'Nom', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL),
(9, 'admin@gmail.com', '$2y$13$P33C5U0Sd/NC0UibIem7D.BLZRqUBKlGWeJp7yaCybo47.SzX0OiW', '[\"ROLE_ADMIN\"]', 'Compte', 'Admin', NULL, NULL, NULL, NULL, NULL, '2024-12-21 16:19:36', 1, NULL, NULL),
(10, 'user@gmail.com', '$2y$13$syOMg4qo54jamwzDrBUlSes1e900eIz1M5tj8vOlequ7IwIvq1FLy', '[]', 'Prénom', 'Nom', 'chill-guy-6766faf1aa87b724348683.webp', 8556, '2024-12-21 17:29:21', NULL, NULL, '2024-12-21 17:27:39', 1, NULL, NULL),
(12, 'tom.boutin@etu.unilim.fr', '$2y$13$DCeIxbMbdEtp7/QTJR.Z0.WtZpnSeM6gKtrz4/1KaGP2MVY6zQKRu', '[]', 'Démo', 'Démo', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL);
COMMIT;


--
-- Déchargement des données de la table `event`
--

INSERT INTO `event` (`id`, `creator_id`, `title`, `description`, `date_start`, `date_end`, `is_visible`, `image`, `image_size`, `updated_at`, `location`, `is_draft`, `is_recommended`, `supprime`, `limit`, `id_token`) VALUES
(1, 1, 'Festival des Lumières', 'Plongez dans un univers féérique avec des installations lumineuses, des spectacles de rue et des animations interactives dans tout le centre-ville. Un rendez-vous incontournable pour les amateurs d’art et de magie.', '2025-08-22 09:30:00', '2025-08-24 19:00:00', '1', 'image-6766de4e3a9de129342830.png', 685391, '2024-12-21 15:27:10', 'Limoges', '0', 1, NULL, '1000', '331c5251-3ebb-4c81-afb8-a9952671b34b'),
(2, 1, 'Marché de Noël Artisanal', 'Découvrez des produits locaux, des objets faits main et des gourmandises de saison dans une ambiance chaleureuse. L’occasion idéale pour dénicher des cadeaux uniques tout en soutenant les artisans de la région.', '2025-12-22 16:45:00', '2025-12-28 20:00:00', '1', 'marches-de-noel-6766dfefe9481034880416.jpg', 1068176, '2024-12-21 15:34:07', 'Niort', '0', NULL, NULL, '500', '3abd155d-f0c1-4a45-8312-41d12fc1e8aa'),
(4, 1, 'Conférence « L’avenir de la technologie verte »', 'Un panel d’experts internationaux discutera des dernières innovations technologiques pour un avenir durable. Réservez votre place pour explorer des idées novatrices et participer au débat.', '2025-04-26 16:00:00', '2025-04-26 17:00:00', '1', 'paysalia-1024x683-6766e2137957e453974691.jpg', 204504, '2024-12-21 15:43:15', 'Zénith de Limoges', '0', 1, NULL, '100', '736ebd53-6d83-4dd7-9f00-6368c27683de'),
(5, 1, 'Atelier Créatif : Fabrication de Bijoux Artisanaux', 'Rejoignez un atelier intimiste pour apprendre à créer vos propres bijoux artisanaux en utilisant des perles, du fil et d’autres matériaux. Chaque participant repart avec ses créations uniques. Convient parfaitement pour une sortie entre amis ou un moment de détente créatif.', '2025-06-23 14:00:00', '2025-06-23 17:45:00', '1', 'bg-creation-6766e29e9b26a241944140.jpg', 62272, '2024-12-21 15:45:34', 'Niort', '0', NULL, NULL, '5', '0fa0ab91-009e-4961-8c7d-669fa15f7eed'),
(6, 1, 'Soirée Jeux de Rôles Immersifs', 'Plongez dans un univers fantastique ou futuriste avec une partie de jeu de rôle narratif. Avec un maître du jeu dédié, vous et vos deux amis incarnez des personnages dans une aventure sur mesure. Pas besoin d\'expérience préalable, juste un esprit d\'équipe et un goût pour l\'imaginaire !', '2025-05-24 15:15:00', '2025-05-24 18:15:00', '1', '66e862ed501b0-6766e86372580816879976.png', 694056, '2024-12-21 16:10:11', 'Limoges', '0', 1, NULL, '3', '8cff639e-b9be-47fc-a22c-22f29f7ca07a'),
(7, 1, 'Marathon Solidaire de la Côte', 'Participez à une course mémorable au bord de la mer, tout en soutenant une bonne cause. Tous les bénéfices iront à une association locale aidant les enfants défavorisés.', '2025-06-21 14:15:00', '2025-06-21 19:00:00', '1', 'marathon-de-montpellier-2020-5-1920x960-6766e8a99384f355021408.jpg', 332680, '2024-12-21 16:11:21', 'Périgueux', '0', NULL, NULL, '200', 'dd44d6fd-1e38-4ddd-b478-53225f73e071'),
(8, 1, 'Concert Gratuit au Parc', 'Un spectacle en plein air avec des artistes locaux et internationaux. Apportez vos pique-niques et profitez d’une soirée de musique dans une ambiance détendue.', '2025-04-29 17:15:00', '2025-04-29 22:30:00', '1', 'ci2i9164-1-815x545-6766e92705045115116678.jpg', 340023, '2024-12-21 16:13:27', 'Niort', '0', NULL, NULL, '150', 'ec3fdc2e-80f1-43c9-acab-965bcb96ae67'),
(9, 1, 'Exposition de sculpture', 'Découvrez une collection exclusive de sculptures modernes et classiques lors d\'une visite guidée. L\'artiste ou un curateur vous accompagne pour expliquer les techniques et les inspirations derrière chaque œuvre. Une occasion unique d’apprécier l’art de manière intime et interactive.', '2025-05-18 09:00:00', '2025-05-25 18:15:00', '1', 'expo-6766e9d5403ce011583904.jpg', 158726, '2024-12-21 16:16:21', 'Périgueux', '0', NULL, NULL, '5000', '7f1d9c99-39ea-4e6e-94b3-e29bebe37ede'),
(11, 10, 'démonstration', '', '2024-12-21 18:45:00', '2024-12-21 19:45:00', '0', NULL, NULL, NULL, '', '0', NULL, '2024-12-21 17:32:26', '100', '6c35fd52-7ec8-45aa-b6a9-99037870ee2a'),
(12, 10, 'démonstration', '', '2024-12-21 18:45:00', '2024-12-21 19:45:00', '1', NULL, NULL, NULL, '', '0', NULL, NULL, '100', '66d3838c-d29e-4f04-928b-07cd470a05cc'),
(13, 10, 'démo brouillon', '', '2024-12-21 18:45:00', '2024-12-21 19:45:00', '0', NULL, NULL, NULL, '', '1', NULL, '2024-12-21 17:33:45', '100', 'd5521db0-afd0-4346-87db-f59eb8416bc8');

--
-- Déchargement des données de la table `event_user`
--

INSERT INTO `event_user` (`event_id`, `user_id`) VALUES
(4, 10),
(4, 12),
(5, 1),
(5, 2),
(5, 7),
(5, 8),
(6, 1),
(6, 2),
(6, 7);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
