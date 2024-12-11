import React, { useState, useEffect } from 'react';
import { EventProps } from "@/types/event";
import { CardEvent } from "@/components/cards/cardEvent"

const PaginatedEvents = () => {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 6; // Nombre d'événements par page

  const fetchEvents = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/events?page=${page}&limit=${itemsPerPage}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des événements');

      const data = await response.json();
      setEvents(data.events); // Adaptez en fonction de la structure réelle de votre réponse API
      setTotalPages(data.totalPages); // Assurez-vous que votre API renvoie un total de pages
    } catch (error) {
      console.error('Erreur :', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          events.map((event) => <CardEvent event={event} key={event.id} />)
        )}
      </div>
      <div className="flex items-center justify-between w-full max-w-md mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default PaginatedEvents;
