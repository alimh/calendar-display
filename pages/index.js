import Head from 'next/head';
import { useEffect, useLayoutEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import {google} from 'googleapis';

const getTime = () => {const time = new Date(); return time.toLocaleString(); }
const getTimezone = () => {return (new Date()).getTimezoneOffset();}
export default function Home(props) {
//       /**
//        * Append a pre element to the body containing the given message
//        * as its text node. Used to display the results of the API call.
//        *
//        * @param {string} message Text to be placed in pre element.
//        */
//       function appendPre(message) {
//         var ul = document.getElementById('event-list');
//         var li = document.createElement('li');
//         var textContent = document.createTextNode(message + '\n');
//         li.appendChild(textContent);
//         ul.appendChild(li);
//       }

//       /**
//        * Print the summary and start datetime/date of the next ten events in
//        * the authorized user's calendar. If no events are found an
//        * appropriate message is printed.
//        */
//       async function listUpcomingEvents() {
//         var now = new Date();
//         var today = new Date(now.toDateString());
//         var tomorrow = new Date(today.getTime() + 86400000);

//         editHeader(now.toDateString().concat('...'));
//         // get all the calendar

//           var calFetches = [];
//           calIds.forEach(function(c) {
//             calFetches.push(gapi.client.calendar.events.list({
//               'calendarId': c,
//               'timeMin': today.toISOString(),
//               'timeMax': tomorrow.toISOString(),
//               'showDeleted': false,
//               'singleEvents': true,
//               'maxResults': 10,
//               'orderBy': 'startTime'
//             }));
//           });

//           var events = [];
//           Promise.allSettled(calFetches).then(function(res) {
//             res.forEach(function(r) {
//               if(r.status === 'fulfilled') {
//                 r.value.result.items.forEach(function(i) {
//                   events.push({summary: i.summary, when: i.start.dateTime || null, allDay: !!i.start.date});
//                 });
//               }
//             });
//             // all events are now in events[]
//             // sort and display
//            events.sort(function(a,b) { 
//              if(a.allDay) { return -1; } 
//              if(b.allDay) { return 1; } 
//              var dateA = new Date(a);
//              var dateB = new Date(b);
//              if(dateA < dateB) { return -1; }
//              return 1;
//            });
//            editHeader(now.toDateString());
//            events.forEach(function(e) {
//              if(e.allDay || e.when === null) appendPre(e.summary);
//              else appendPre(new Date(e.when).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) + ': ' + e.summary);
//             });
//           });
//       }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <p id="header">Calendar List</p>

<ul id="event-list">
<li>{getTime()}</li>
<li>{getTimezone()}</li>
</ul>

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
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 7);

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

console.log(today);
console.log(tomorrow);

const events = [];
const eventsSorted = [];
for(let i = 0; i < 7; i ++) {
  let tempDate = new Date(new Date().setDate(today.getDate() + i));
  eventsSorted[i] = {
    date: tempDate.toUTCString(),
    events: [],
  };
};
console.log('eventsSorted', eventsSorted);
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
  // events.forEach(e => console.log(e.summary, e.when, new Date(e.when).getDay()));

  console.log(events);
  console.log(eventsSorted);
});

return {
  props: {
    header: 'Events for '.concat(today),
    events: events.filter(e => !!e.summary),
  },
  revalidate: 5,
};
}