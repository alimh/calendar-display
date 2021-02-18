import Head from 'next/head';
import { useEffect, useLayoutEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import {google} from 'googleapis';

export default function Home({events, updated}) {
  const [devMode, setDevMode] = useState(false);

  const tooggleDevMode = () => {
    setDevMode(!devMode);
  }

  const displayEvents = () => {
    const now = new Date();
    const todayLocal = new Date(now.toLocaleDateString());
    const tomorrowLocal = new Date((new Date(todayLocal)).setDate(todayLocal.getDate() + 7));
    const eventsFiltered = events.map(e => {
      const eDate = new Date(e.when);
//      console.log(e.summary, e.when, !e.allDay ? eDate : new Date(eDate.setMinutes(eDate.getMinutes() + todayLocal.getTimezoneOffset())));
      return {...e, when: !e.allDay ? eDate : new Date(eDate.setMinutes(eDate.getMinutes() + todayLocal.getTimezoneOffset()))};
    }).
      filter(e => e.when >= todayLocal && e.when < tomorrowLocal);
    // now that we have filtered events, we can display them in lists
    let prevDate = todayLocal.toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'});
    return (
      <>
      {devMode ? <div>
        Now: {now.toString()}<br />
        Today Local: {todayLocal.toString()}<br />
        Tomorrow Local: {tomorrowLocal.toString()}<br />
      </div> : null}
        <div className={styles.eventToday}>
          <div className={styles.eventDate}>{prevDate}</div>
          {todayLocal.toLocaleDateString() !== (new Date(eventsFiltered[0].when)).toLocaleDateString() && <li key='no-events'><div className={styles.eventAllDay}>no events</div></li>}
        </div>
        {eventsFiltered.map((e,i) => {
          const eDate = new Date(e.when);
          const dateLocal = eDate.toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'});
          const timeLocal = !e.allDay ? eDate.toLocaleTimeString([], {hour: 'numeric', minute: 'numeric'}) : null;
          const li = ({showDateHeader = false} = {}) => (
            <div className={todayLocal.toLocaleDateString() === eDate.toLocaleDateString() ? styles.eventToday : styles.eventNormal}>
              {showDateHeader ? <div className={styles.eventDate}>{dateLocal}</div> : null}
              <li key={i}>
                {timeLocal ? <div className={styles.eventTime}>{timeLocal}</div> : <div className={styles.eventAllDay}>all day</div>}
                <div className={styles.eventTitle}>{e.summary}</div>
                {devMode ? <div className={styles.eventTitle}>D: {dateLocal} T:{timeLocal} E:{eDate.toLocaleString()}</div> : null}
                {devMode ? <div className={styles.eventTitle}>Left: {todayLocal.toLocaleDateString()} Right:{eDate.toLocaleDateString()}</div> : null}
              </li>
            </div>
          );
              
          if(dateLocal !== prevDate) {
            prevDate = dateLocal;
            return li({showDateHeader: true});
          }

          return li();
        })}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>My Agenda</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ul className={styles.list}>
          {displayEvents()}
        </ul>

        <div className={styles.footer}><button onClick={() => tooggleDevMode()}>Updated</button>: {updated}</div>
      </main>
    </div>
  )
}

export async function getStaticProps() {
const auth = await new google.auth.GoogleAuth({
  projectId: process.env.PROJECT_ID,
  credentials: {client_email: process.env.CLIENT_EMAIL, private_key: JSON.parse(process.env.PRIVATE_KEY)},
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});
const cal = google.calendar('v3');
const calList = [
  'alim.haji@gmail.com', 
  'dbou2b3k57raho7hcv02ujcs10@group.calendar.google.com', // Dunkin David
  'addressbook#contacts@group.v.calendar.google.com', // Birthdays
  'cfsnsbbofrtqfjqdidqj83kgcc@group.calendar.google.com', // Social events
  '4cu8n1papg1ovklv1944dceo94@group.calendar.google.com' // Dunkin
];
const now = new Date();
const today = new Date(now.toDateString());
today.setDate(today.getDate() - 1);  // set date to one day before
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 8);  // set end date to one day after

const calFetches = [];
calList.forEach(c => {
  calFetches.push(cal.events.list({
    auth,
    calendarId: c,
    timeMin: today.toISOString(),
    timeMax: tomorrow.toISOString(),
    showDeleted: false,
    singleEvents: true,
  }));
});

const events = [];
await Promise.allSettled(calFetches).then(res => {
  res.forEach(r => {
    if (r.status === 'fulfilled') {
      r.value.data.items.forEach(i => {
        events.push({ summary: i.summary, when: i.start.dateTime || i.start.date || null, allDay: !!i.start.date })
      });
    }
  });
  events.sort((a,b) => {
             var dateA = new Date(a.when);
             var dateB = new Date(b.when);
             if(dateA < dateB) { return -1; }
             return 1;
  });
});
//console.log('Events from server:', events);
return {
  props: {
    events: events.filter(e => !!e.summary),
    updated: now.toLocaleString(),
  },
 revalidate: 60*60*6, // reavalidate ever 6 hours
};
}