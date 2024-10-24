'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 
import timeGridPlugin from '@fullcalendar/timegrid'
import frLocale from '@fullcalendar/core/locales/fr' 
import '@/app/globals.css'

export default function Calendar() {
  return (
    <div className='m-16'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        headerToolbar={{
          left: 'title prev,next today',
          center: '',
          right: 'timeGridDay,timeGridWeek,dayGridMonth'
        }}
        initialView='timeGridWeek'
        locale={frLocale}
        allDaySlot={false}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
        }}
        titleFormat={{ year: 'numeric', month: 'long' }}
        dayHeaderContent={(args) => {
          const date = new Date(args.date);
          const day = date.toLocaleDateString('fr-FR', { weekday: 'short' });
          const dayNumber = date.getDate();
          return (
            <div className='flex flex-row gap-1 text-center'>
              <div className='capitalize'>{day}</div>
              <div>{dayNumber}</div>
            </div>
          );
        }}
      />
    </div>
  )
}