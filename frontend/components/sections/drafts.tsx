import { CardDraft } from "@/components/cards/cardDraft";
import { fetchEventDrafts } from "@/lib/data";
import { useUser } from "@/contexts/UserProvider";
import { useEffect, useState } from "react";

export default function Drafts() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const loadDrafts = async () => {
    if (user) {
      try {
        const events = await fetchEventDrafts(user.id);
        console.log(events);
        setDrafts(events);
      } catch (error) {
        console.error("Erreur lors de la récupération des brouillons :", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadDrafts();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl w-full justify-self-center pt-5 px-5">
      {drafts.length > 0 ? (
        drafts.map((draft) => (
          <CardDraft key={draft.id} event={draft} onEventChange={loadDrafts} />
        ))
      ) : (
        <p>Aucun brouillon disponible.</p>
      )}
    </div>
  );
}