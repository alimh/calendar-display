import Head from 'next/head';
import { useEffect, useLayoutEffect, useState } from 'react';
import styles from '../styles/Home.module.css'

export default function Home() {
  const [signedInState, setSignedInState] = useState(false);

  const CLIENT_ID = '63507242688-n50bdqjfiga374n05gjelvoks2a286nf.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyC96wPL-fh-L93cxuwnyYZW9uAfbEB6Rks';

  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

        /**
       *  On load, called to load the auth2 library and API client library.
       */
      // const handleClientLoad = () => {
      //   gapi.load('client:auth2', initClient);
      // }
useEffect(() => {
        gapi.load('client:auth2', initClient);
},[]);
      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      const initClient = () => {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        }, function(error) {
          appendPre(JSON.stringify(error, null, 2));
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          setSignedInState(true);
          listUpcomingEvents();
        } else {
          setSignedInState(false);
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var ul = document.getElementById('event-list');
        var li = document.createElement('li');
        var textContent = document.createTextNode(message + '\n');
        li.appendChild(textContent);
        ul.appendChild(li);
      }

      function editHeader(date) {
        var header = document.getElementById('header')
        header.innerText = 'Events for '.concat(date);
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      async function listUpcomingEvents() {
        var now = new Date();
        var today = new Date(now.toDateString());
        var tomorrow = new Date(today.getTime() + 86400000);

        editHeader(now.toDateString().concat('...'));
        // get all the calendar
        var calIds = [];
        var resCalIds = await gapi.client.calendar.calendarList.list();
        resCalIds.result.items.forEach(function(c) {
            calIds.push(c.id);
          });

          var calFetches = [];
          calIds.forEach(function(c) {
            calFetches.push(gapi.client.calendar.events.list({
              'calendarId': c,
              'timeMin': today.toISOString(),
              'timeMax': tomorrow.toISOString(),
              'showDeleted': false,
              'singleEvents': true,
              'maxResults': 10,
              'orderBy': 'startTime'
            }));
          });

          var events = [];
          Promise.allSettled(calFetches).then(function(res) {
            res.forEach(function(r) {
              if(r.status === 'fulfilled') {
                r.value.result.items.forEach(function(i) {
                  events.push({summary: i.summary, when: i.start.dateTime || null, allDay: !!i.start.date});
                });
              }
            });
            // all events are now in events[]
            // sort and display
           events.sort(function(a,b) { 
             if(a.allDay) { return -1; } 
             if(b.allDay) { return 1; } 
             var dateA = new Date(a);
             var dateB = new Date(b);
             if(dateA < dateB) { return -1; }
             return 1;
           });
           editHeader(now.toDateString());
           events.forEach(function(e) {
             if(e.allDay || e.when === null) appendPre(e.summary);
             else appendPre(new Date(e.when).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) + ': ' + e.summary);
            });
          });
      }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <script async defer src="https://apis.google.com/js/api.js"></script>
      </Head>

      <main className={styles.main}>
      <p id="header">Events for Today</p>

<ul id="event-list">

</ul>
<button id="authorize_button" style={{display: !signedInState ? 'block' : 'none'}} onClick={() => handleAuthClick()}>Authorize</button>
<button id="signout_button" style={{display: signedInState ? 'block' : 'none'}} onClick={() => handleSignoutClick()}>Sign Out</button>

<pre id="content"></pre>

      </main>
    </div>
  )
}
