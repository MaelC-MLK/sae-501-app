import React from 'react';
import { k2d } from '@/app/fonts/fonts';

export default function PolitiqueConfidentialite() {
  return (
    <div className="container mx-auto px-4 pb-10 pt-20">
      <h1 className={`${k2d.className} text-3xl font-bold`}>Politique de Confidentialité</h1>

      <p className='text-sm md:text-base text-muted-foreground mt-1 mb-6'>Dernière modification : <span>04/12/2024</span></p>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
        <p>
          Chez Eventify, nous prenons la confidentialité de vos informations personnelles très au sérieux. Cette politique de confidentialité explique quelles informations nous collectons, comment nous les utilisons et les protégeons.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. Informations collectées</h2>
        <p>
          Nous collectons les informations suivantes lorsque vous utilisez notre site :
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Informations de contact (nom, prénom, adresse e-mail)</li>
          <li>Informations de compte (adresse e-mail, mot de passe)</li>
          <li>Informations sur les événements (détails de l&apos;événement, participants)</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Utilisation des informations</h2>
        <p>
          Nous utilisons les informations collectées pour :
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Fournir et améliorer nos services</li>
          <li>Gérer votre compte et vos inscriptions</li>
          <li>Communiquer avec vous concernant votre compte et vos événements</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Partage des informations</h2>
        <p>
          Nous ne partageons pas vos informations personnelles avec des tiers, sauf dans les cas suivants :
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Avec votre consentement</li>
          <li>Pour se conformer à des obligations légales</li>
          <li>Pour protéger nos droits et notre propriété</li>
          <li>En cas de fusion ou d&apos;acquisition</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Sécurité des informations</h2>
        <p>
          Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles contre tout accès, utilisation ou divulgation non autorisés. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n&apos;est totalement sécurisée, et nous ne pouvons garantir une sécurité absolue.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Vos droits</h2>
        <p>
          Vous avez le droit d&apos;accéder à vos informations personnelles, de les corriger, de les supprimer ou de limiter leur utilisation. Vous pouvez également vous opposer à leur traitement ou demander leur portabilité. Pour exercer ces droits, veuillez nous contacter à l&apos;adresse suivante : contact@eventify.com.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">7. Modifications de la politique de confidentialité</h2>
        <p>
          Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec la date de mise à jour. Nous vous encourageons à consulter régulièrement cette page pour rester informé des changements éventuels.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">8. Contact</h2>
        <p>
          Si vous avez des questions ou des préoccupations concernant cette politique de confidentialité, veuillez nous contacter à l&apos;adresse suivante : contact@eventify.com.
        </p>
      </section>
    </div>
  );
}