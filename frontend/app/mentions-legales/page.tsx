import React from 'react';
import { k2d } from '@/app/fonts/fonts';

export default function MentionsLegales() {
  return (
    <div className="container mx-auto px-4 pb-10 pt-20">
      <h1 className={`${k2d.className} text-3xl font-bold`}>Mentions Légales</h1>

      <p className='text-sm md:text-base text-muted-foreground mt-1 mb-6'>Dernière modification : <span>04/12/2024</span></p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Éditeur du site</h2>
        <p>
          Nom de l'entreprise : Eventify<br />
          Adresse : 12 All. André Maurois, 87065 Limoges, France<br />
          Téléphone : +33 1 23 45 67 89<br />
          Email : contact@eventify.com<br />
          Directeur de la publication : Maël Cheron
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Hébergement</h2>
        <p>
          Nom de l'hébergeur : Pulsheberg<br />
          {/* Adresse : 2 Rue Kellermann, 59100 Roubaix, France<br /> */}
          {/* Téléphone : +33 9 72 10 10 07<br /> */}
          Site web : <a href="https://pulseheberg.com/" className="text-primary hover:underline">www.pulseheberg.com</a>
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Propriété intellectuelle</h2>
        <p>
          Le contenu du site Eventify, incluant, de façon non limitative, les graphismes, images, textes, vidéos, animations, sons, logos, gifs et icônes ainsi que leur mise en forme sont la propriété exclusive de la société Eventify à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Données personnelles</h2>
        <p>
          Conformément à la loi Informatique et Libertés du 6 janvier 1978, vous disposez d'un droit d'accès, de rectification, de modification et de suppression des données qui vous concernent. Vous pouvez exercer ce droit en envoyant un courrier à l'adresse suivante : Eventify, 12 All. André Maurois, 87065 Limoges, France ou par email à contact@eventify.com.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Cookies</h2>
        <p>
          Le site Eventify peut-être amené à vous demander l'acceptation des cookies pour des besoins de statistiques et d'affichage. Un cookie est une information déposée sur votre disque dur par le serveur du site que vous visitez. Il contient plusieurs données qui sont stockées sur votre ordinateur dans un simple fichier texte auquel un serveur accède pour lire et enregistrer des informations.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Liens hypertextes</h2>
        <p>
          Le site Eventify peut contenir des liens hypertextes vers d'autres sites présents sur le réseau Internet. Les liens vers ces autres ressources vous font quitter le site Eventify. Il est possible de créer un lien vers la page de présentation de ce site sans autorisation expresse de Eventify. Aucune autorisation ou demande d'information préalable ne peut être exigée par l'éditeur à l'égard d'un site qui souhaite établir un lien vers le site de l'éditeur. Il convient toutefois d'afficher ce site dans une nouvelle fenêtre du navigateur. Cependant, Eventify se réserve le droit de demander la suppression d'un lien qu'il estime non conforme à l'objet du site Eventify.
        </p>
      </section>
    </div>
  );
}