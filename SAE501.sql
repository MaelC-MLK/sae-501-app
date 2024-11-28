-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql
-- Généré le : ven. 22 nov. 2024 à 17:18
-- Version du serveur : 8.3.0
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
-- Déchargement des données de la table `event`
--

INSERT INTO `event` (`id`, `creator_id`, `title`, `description`, `date_start`, `date_end`, `is_visible`, `image`, `image_size`, `updated_at`, `location`, `is_draft`, `is_recommended`) VALUES
(11, 1, 'Festival Lumières d’Automne', 'Festival annuel avec spectacles de lumière, concerts en plein air et stands gourmands au Parc des Étoiles.', '2024-11-15 15:00:00', '2024-11-15 23:45:00', '1', '', 663893, '2024-11-15 15:30:19', 'Limoges', '0', NULL),
(12, 2, 'Salon de l’Innovation Verte', 'Exposition sur les technologies écologiques et les solutions durables au Palais des Congrès.', '2024-11-18 16:30:00', '2024-11-18 17:30:00', '1', 'paysalia-1024x683-6737695a03da6369608642.jpg', 204504, '2024-11-15 15:31:38', 'Limoges', '0', 1),
(10, 1, 'Les Nuits de la Sculpture', 'Exposition en plein air de sculptures lumineuses et interactives au Jardin des Arts.', '2024-11-13 16:45:00', '2024-11-13 17:45:00', '1', '', 158726, '2024-11-15 15:33:17', 'Limoges', '0', NULL),
(9, 2, 'Course des Aventuriers', 'Trail de 10 km pour coureurs amateurs et confirmés dans la forêt de la Vallée Verte.', '2024-11-17 08:00:00', '2024-11-17 22:00:00', '1', 'visuel-predicttrail-v2-67376b49ca9cb156538251.jpg', 183670, '2024-11-15 15:39:53', 'Limoges', '0', 1),
(5, 1, 'Journée Médiévale au Château des Brumes', 'Reconstitution historique avec animations, artisans, et dégustation de mets médiévaux.', '2024-11-28 16:45:00', '2024-11-28 17:45:00', '1', 'les-serveurs-du-banquet-1200-67376c34d53a8925710597.jpg', 103012, '2024-11-15 15:43:48', 'Limoges', '0', NULL),
(6, 2, 'Concert Symphonique en Plein Air', 'Performance de l’Orchestre Harmonia sur l’Esplanade du Lac.', '2024-11-21 17:00:00', '2024-11-21 19:30:00', '1', 'ci2i9164-1-815x545-67376d4461244609048836.jpg', 340023, '2024-11-15 15:48:20', 'Limoges', '0', 1),
(7, 1, 'Fête des Lanternes de Minuit', 'Célébration nocturne avec lanternes flottantes sur le Lac du Silence.', '2024-11-24 19:45:00', '2024-11-24 21:15:00', '1', 'image-67376dd31b963400338551.png', 685391, '2024-11-15 15:50:43', 'Limoges', '0', 1),
(8, 2, 'Journée des Sports Nautiques', 'Initiations gratuites à la voile, au kayak, et au paddle au Port de l’Océan Bleu.', '2024-11-27 08:00:00', '2024-11-27 21:00:00', '1', '43-67376e8a346fa204480234.jpg', 59956, '2024-11-15 15:53:46', 'La Rochelle', '0', NULL);

--
-- Déchargement des données de la table `event_user`
--

INSERT INTO `event_user` (`event_id`, `user_id`) VALUES
(1, 2),
(2, 2),
(4, 2),
(6, 2);

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `roles`, `first_name`, `last_name`, `avatar`, `plain_password`, `verification_token`, `token_expiry`, `logout`) VALUES
(1, 'demo@gmail.com', '$2y$13$b6Nnm3S/V2R3Jabq1Zbgre8djpHrCZyF0QYryKrqsv7zQ4a/8nWya', '[]', 'Prenom', 'Nom', NULL, NULL, NULL, NULL, NULL),
(2, 'test@gmail.com', '$2y$13$lONY8ouZumR9Zr0h3aqnM.6xOFxtYmOSl0BWPQpGIOGTqWjiyl.MC', '[]', 'Test', 'Bonjour', NULL, NULL, NULL, NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
