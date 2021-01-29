import Head from 'next/head';
import { useEffect, useLayoutEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import {google} from 'googleapis';

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
console.log(props);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <p id="header">Calendar List</p>

<ul id="event-list">
{props.events?.map(e => (<li key={e.id}>{e.summary}</li>))}
</ul>

      </main>
    </div>
  )
}

export async function getStaticProps() {
  console.log('FROM STATIC PROPS:', process.env.PROJECT_ID, process.env.PRIVATE_KEY);
const auth = await new google.auth.GoogleAuth({
  projectId: process.env.PROJECT_ID,
  credentials: {client_email: process.env.CLIENT_EMAIL, private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCpKnFofjKsDCe5\nCvRq9i1K/c5W3ROpqkbHW7FqAveRG+Ypkse5ijtiQAxAGtYRe6EyxTXoQRU06iaV\nhMdVZDQ2n0lq21muj3qmEb/6zzIgB06SmI12tgfa17SVh9Wve6YCpc5lPsiuKTeT\nkETqe0RLtNMeDyCQ9Whmf6dUnikeY7TCY1Ynb1Du+D71Mu+ZgfCcmrjsLtqdlVc1\naltkwv8By1m18oNgGZfUHuGkApSeYz99glsRvhCeC8TJSs/pToYX3qiwBNNgZmeI\neHT7WUXbS11rXZKpLOSQn9R3U+tpFdEwReUi8CDwEUnpC91gzAYU2cWaHIwmw7GU\nxwIYg7/TAgMBAAECggEAGD/TyvFQLTZ+2Tk3ST/pxTa1xeDiCS+1/qzntTUgrOXt\na+c1ByVIFvDscKIILrBkrqTzccwmkJPCHSvP8S8whuX1fcJczDeYEsc3mGnsGwhB\nHKWOncZBQP8rzUWP/ZxBc162Q/Aoj0KsS1RidKRf6WRN4SC0/+KV6R+CapBTf536\neVy/1adp3B+ZdKBVr4CLmfBXC/IjDMgLo2//8GeaFYvqo4K8ZvSOSv6PFUmCY1ax\nGCs92OuGHn9pjII0/Ljods3HTlvAGea6qakmHLceWN8AMW5WnPX8ABxWE3/Tv+84\nnwdDkNHR0mIl7tEhjziqCuvP38t02DddgTpeU320/QKBgQDhQ6j4jFrxys9yzlqA\n4ev5iw+4l92I8BvnOhiL7oufy8tTjzYGw3dnVn2dO/nspGkpGayZtHGH+HTUkZQV\nwKJlY/so0ytlPMhLNvVtTK1lDzeKJQvZZf5wyeOdNijeZMF8BQkuFz1sPyVBm4RR\npMXWh8jwfmHCT3MBLuLXRk7x5QKBgQDAP0wsykGUOSSZTA+ebDS/ep7acbApqcsD\nL8Wjy9knx8mZyzGAJi3TQOhKzPqXI98gG7/mgHR3sl52I8z6FtqOgDBXaAbwVd8I\nLwS7hbVYhTDUxnmd0EP+kk+JrTeNQwhNwAZ1LiGtc2D0GRJOXxv3BMPpTDLHq4TM\ncwd7VcSvVwKBgAG0cWLwLQAHeOp1hVnUW+TXmJbdD2Ap8Qwe9HCarZPYBwHq443J\njO3LScgW3B1eYS1edF/1baaJytiRAX3op1H9H7l/X6S0gQ+QqurY2bcaFmGFRkGu\n8+4GmSJndoe4W36Eyzz+EAjxsWZ9ttKnXJfzDyJC0pqV31jy8eSPM6nBAoGBAKha\nxiqzNJrJL/PPWB40RD0q9NH3nX3e45n2y+2VJqZfn3y/JKpExPyrasGWoBybnVpQ\n8sy40UXBPlfXIjogqWUBfVQOFYWCrb5M7qgJf7X1bb3n0bkSGXlmR6EZv/xFJ5Bv\nCTi1HWj4EX+yNQXM5IB9+9Lil9WjrrgcRAEOKyAhAoGBAJC6QYAWMJva7SKkWwps\nR0d7d3eFsRB0l9Pp0+D9uSv46vIAuvgh0kHG6eZaKKHp7pmNLIa79siRxXqTQTxJ\nek/5wLDyIl/BdSj8W+ETFjhOEYiQjaSRCmyw3YtR0g8iHHqhW0+OYcKgvCXYCHyH\ncC8sazrwXca7tY1H6wQMo0wv\n-----END PRIVATE KEY-----\n"},
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
const tomorrow = new Date(today.getTime() + 7*86400000);
console.log('today', today);
console.log('tomorrow', tomorrow);
const calFetches = [];
calList.forEach(c => {
calFetches.push(cal.events.list({
  auth,
  calendarId: c,
  timeMin: today.toISOString(),
  timeMax: tomorrow.toISOString(),
  showDeleted: false,
  // singleEvents: true,
}));
});
const events = [];
await Promise.allSettled(calFetches).then(res => {
  res.forEach(r => {
    if (r.status === 'fulfilled') {
      r.value.data.items.forEach(i => {
        events.push({ summary: i.summary, when: i.start.dateTime || null, allDay: !!i.start.date })
      });
    }
  });
  // events.sort((a,b) => {
  //            if(a.allDay) { return -1; } 
  //            if(b.allDay) { return 1; } 
  //            var dateA = new Date(a);
  //            var dateB = new Date(b);
  //            if(dateA < dateB) { return -1; }
  //            return 1;
  // });
});
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

return {
  props: {
    header: 'Events for '.concat(today),
    events,
  },
  revalidate: 5,
};
}