-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql
-- Généré le : ven. 25 oct. 2024 à 19:37
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

INSERT INTO `event` (`id`, `title`, `description`, `date_start`, `date_end`, `is_visible`, `image`, `location`, `is_draft`) VALUES
(1, 'Festival de musique', 'Le festival rassemble chaque année des artistes de divers horizons et offre une programmation variée, mêlant têtes d’affiche et découvertes locales. Le public est invité à profiter de concerts en plein air, dans une ambiance conviviale, où la musique se mêle aux animations et aux espaces de restauration sur place.', '2025-07-07 09:30:00', '2025-07-13 23:45:00', 1, NULL, 'Limoges', 0),
(2, 'Exposition d’art', 'Cette exposition propose une sélection d\'œuvres d\'artistes contemporains et classiques, offrant aux visiteurs un parcours riche en découvertes visuelles et narratives. Les œuvres sont disposées pour valoriser chaque expression artistique, dans un cadre paisible et inspirant, propice à la contemplation.', '2024-10-27 08:30:00', '2024-10-27 20:15:00', 1, '', 'Limoges', 0),
(3, 'Festival de cinéma', 'Le festival de cinéma est une célébration du 7ème art où sont projetés des films d’horizons divers, des avant-premières aux classiques restaurés. Les projections, réparties dans plusieurs salles, sont ouvertes au grand public et permettent d’assister à des rencontres avec des réalisateurs et des acteurs.', '2024-10-25 19:00:00', '2024-10-27 23:30:00', 1, '', 'Limoges', 0),
(4, 'Marché de Noël', 'Le marché de Noël propose une variété d’artisanat, de produits locaux, et de décorations festives dans un décor hivernal. Les visiteurs peuvent flâner entre les stands, déguster des spécialités régionales et profiter de l’ambiance chaleureuse avec des activités pour petits et grands.', '2024-12-16 18:30:00', '2024-12-22 23:45:00', 1, '', 'Limoges', 0),
(5, 'Brocante et vide-greniers', 'Les brocantes rassemblent des particuliers et des marchands qui proposent à la vente des objets anciens, des meubles et des curiosités. Les visiteurs peuvent chiner et découvrir des trésors uniques dans une ambiance conviviale, souvent accompagnée d’animations locales.', '2024-09-28 07:00:00', '2024-09-28 20:15:00', 1, '', 'Limoges', 0),
(6, 'Feu d’artifice', 'Le feu d’artifice est un spectacle visuel organisé en soirée, où les visiteurs peuvent observer une série de lumières colorées dans le ciel. Le public est invité à se rassembler dans des espaces sécurisés pour profiter de ce moment festif et lumineux.', '2024-07-14 22:30:00', '2024-07-14 23:45:00', 1, '', 'Limoges', 0),
(7, 'Conférence', 'La conférence est un événement ouvert où des experts partagent leurs connaissances sur un thème précis. Le public est invité à écouter et à participer aux débats dans un cadre informel et enrichissant, permettant des échanges directs avec les intervenants.', '2024-11-06 16:00:00', '2024-11-06 18:00:00', 1, '', 'Limoges', 0),
(8, 'Dîner entre collègues', 'Soirée tranquille autour d’un bon repas, discussions légères, idéal pour décompresser après le travail.', '2024-11-09 19:30:00', '2024-11-09 23:30:00', 0, '', 'Limoges', 0),
(9, 'Réunion familiale', 'Rassemblement familial chez tante Lucie. Prévoir des jeux pour les enfants et organiser un repas partagé.', '2025-01-11 19:30:00', '2025-01-11 23:45:00', 0, '', 'Limoges', 0),
(10, 'Soirée karaoké', '', '2024-08-03 18:30:00', '2024-08-03 20:30:00', 0, '', 'Limoges', 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
