import React from 'react';
import { k2d } from '@/app/fonts/fonts';

export default function ConditionsUtilisation() {
  return (
    <div className="container mx-auto px-4 pb-10 pt-20">
      <h1 className={`${k2d.className} text-3xl font-bold`}>Conditions d&apos;Utilisation</h1>

      <p className='text-sm md:text-base text-muted-foreground mt-1 mb-6'>Dernière modification : <span>04/12/2024</span></p>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">1. Acceptation des conditions</h2>
        <p>
          En accédant et en utilisant le site Eventify, vous acceptez d&apos;être lié par les présentes conditions d&apos;utilisation, toutes les lois et réglementations applicables, et acceptez que vous êtes responsable du respect de toutes les lois locales applicables. Si vous n&apos;êtes pas d&apos;accord avec ces conditions, vous êtes interdit d&apos;utiliser ou d&apos;accéder à ce site.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">2. Utilisation de la licence</h2>
        <p>
          La permission est accordée de télécharger temporairement une copie des documents (informations ou logiciels) sur le site Eventify pour une visualisation transitoire personnelle et non commerciale uniquement. Il s&apos;agit de l&apos;octroi d&apos;une licence, non d&apos;un transfert de titre, et sous cette licence, vous ne pouvez pas :
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>modifier ou copier les documents ;</li>
          <li>utiliser les documents à des fins commerciales, ou pour toute exposition publique (commerciale ou non commerciale) ;</li>
          <li>tenter de décompiler ou de désosser tout logiciel contenu sur le site Eventify ;</li>
          <li>supprimer tout droit d&apos;auteur ou autres notations de propriété des documents ; ou</li>
          <li>transférer les documents à une autre personne ou &quot;miroiter&quot; les documents sur tout autre serveur.</li>
        </ul>
        <p>
          Cette licence prendra automatiquement fin si vous violez l&apos;une de ces restrictions et peut être résiliée par Eventify à tout moment. Lors de la résiliation de votre visualisation de ces documents ou à la fin de cette licence, vous devez détruire tous les documents téléchargés en votre possession, que ce soit sous format électronique ou imprimé.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">3. Clause de non-responsabilité</h2>
        <p>
          Les documents sur le site Eventify sont fournis &quot;tels quels&quot;. Eventify ne donne aucune garantie, expresse ou implicite, et décline par la présente toutes les autres garanties, y compris sans limitation, les garanties implicites ou les conditions de qualité marchande, d&apos;adéquation à un usage particulier, ou de non-violation de la propriété intellectuelle ou autre violation des droits. De plus, Eventify ne garantit ni ne fait aucune représentation concernant l&apos;exactitude, les résultats probables, ou la fiabilité de l&apos;utilisation des documents sur son site Internet ou autrement liés à ces documents ou sur tout site lié à ce site.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">4. Limitations</h2>
        <p>
          En aucun cas Eventify ou ses fournisseurs ne seront responsables des dommages (y compris, sans limitation, les dommages pour perte de données ou de profit, ou en raison d&apos;une interruption d&apos;activité) résultant de l&apos;utilisation ou de l&apos;incapacité d&apos;utiliser les documents sur le site Eventify, même si Eventify ou un représentant autorisé de Eventify a été notifié oralement ou par écrit de la possibilité de tels dommages. Parce que certaines juridictions ne permettent pas de limitations sur les garanties implicites, ou des limitations de responsabilité pour les dommages consécutifs ou accessoires, ces limitations peuvent ne pas s&apos;appliquer à vous.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">5. Précision des matériaux</h2>
        <p>
          Les documents apparaissant sur le site Eventify pourraient inclure des erreurs techniques, typographiques ou photographiques. Eventify ne garantit pas que l&apos;un des documents sur son site Web est exact, complet ou actuel. Eventify peut apporter des modifications aux documents contenus sur son site Web à tout moment sans préavis. Cependant, Eventify ne prend aucun engagement de mettre à jour les documents.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">6. Liens</h2>
        <p>
          Eventify n&apos;a pas examiné tous les sites liés à son site Internet et n&apos;est pas responsable des contenus de ces sites liés. L&apos;inclusion de tout lien n&apos;implique pas l&apos;approbation par Eventify du site. L&apos;utilisation de tout site Web lié est aux risques et périls de l&apos;utilisateur.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">7. Modifications</h2>
        <p>
          Eventify peut réviser ces conditions d&apos;utilisation de son site Web à tout moment sans préavis. En utilisant ce site Web, vous acceptez d&apos;être lié par la version actuelle de ces conditions d&apos;utilisation.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">8. Droit applicable</h2>
        <p>
          Ces conditions sont régies et interprétées conformément aux lois de la France et vous vous soumettez irrévocablement à la juridiction exclusive des tribunaux de cet État ou de ce lieu.
        </p>
      </section>
    </div>
  );
}