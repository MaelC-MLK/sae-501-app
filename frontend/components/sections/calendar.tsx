'use client'

import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import frLocale from '@fullcalendar/core/locales/fr';
import '@/app/globals.css';

export default function Calendar() {
  const [calendarView, setCalendarView] = useState('timeGridWeek');
  const [headerToolbar, setHeaderToolbar] = useState({
    left: 'title prev,next today',
    center: '',
    right: 'timeGridDay,timeGridWeek,dayGridMonth'
  });
  const calendarRef = useRef<FullCalendar>(null);

  const handleWindowResize = () => {
    const { innerWidth } = window;
    if (innerWidth < 768) {
      setCalendarView('timeGridDay');
      setHeaderToolbar({
        left: 'prev,next',
        center: 'title',
        right: 'today'
      });
    } else if (innerWidth < 1024) {
      setCalendarView('timeGridWeek');
      setHeaderToolbar({
        left: 'title prev,next today',
        center: '',
        right: 'timeGridDay,timeGridWeek,dayGridMonth'
      });
    } else {
      setHeaderToolbar({
        left: 'title prev,next today',
        center: '',
        right: 'timeGridDay,timeGridWeek,dayGridMonth'
      });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    handleWindowResize(); // Initial call to set the view based on the current window size
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(calendarView);
    }
  }, [calendarView]);

  return (
    <div className='m-8 md:m-16 calendar-container'>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin]}
        headerToolbar={headerToolbar}
        initialView={calendarView}
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
            <div className='flex flex-col text-center'>
              <div className='capitalize font-normal'>{day}</div>
              <div className='text-2xl font-semibold'>{dayNumber}</div>
            </div>
          );
        }}
      />
    </div>
  );
}