import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteEventAndNotify } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export default function PopupDeleteEvent({
  eventId,
  onClose,
  onDelete,
}: {
  eventId: number;
  onClose: () => void;
  onDelete: () => void;
}) {
  const {toast} = useToast();

  const handleDelete = async () => {
    try {
      onDelete();
      await deleteEventAndNotify(eventId);
      toast({
        title: "Événement supprimé ! ✅",
        description: "Votre événement a été supprimé avec succès.",
        // action: (
        //     <ToastAction altText="Annuler">Annuler</ToastAction>
        // ),
    });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
      toast({
        title: "Erreur lors de la suppression de l'événement ❌",
        description: "Une erreur est survenue lors de la suppression de l'événement.",
        // action: (
        //     <ToastAction altText="Annuler">Annuler</ToastAction>
        // ),
    });
    }
  };

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Cela supprimera définitivement votre événement.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
