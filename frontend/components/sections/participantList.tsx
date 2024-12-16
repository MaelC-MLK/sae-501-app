import Image from "next/image";
import { Avatar, Button } from "some-component-library"; // Adjust the import path as necessary

function ParticipantsList({ participants, onRemoveParticipant }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Liste des participants</h2>
      <ul className="space-y-2">
        {participants.map((participant: any) => (
          <li key={participant.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="mr-2">
                <Image
                  src={participant.avatar ? process.env.API_BASE_URL + "/uploads/users/" + participant.avatar : "/images/profile-picture.webp"}
                  alt={participant.firstName}
                  height={40}
                  width={40}
                  unoptimized={true}
                  className="rounded-full shrink-0 overflow-hidden object-cover"
                />
              </Avatar>
              <span className="capitalize">{participant.firstName} {participant.lastName}</span>
            </div>
            <Button variant="destructive" size="sm" onClick={() => onRemoveParticipant(participant.id)}>
              Supprimer
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ParticipantsList;