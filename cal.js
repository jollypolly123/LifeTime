// Client ID and API key from the Developer Console
var CLIENT_ID = '1071665484122-t30i85ii00of07a69p7teisg688c6g0l.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBhx1tzgIogp7lklO4EG9Ey8MtV39HNOms';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var createEventButton = document.getElementById('create_event');
var adjustPreferencesButton = document.getElementById('adjust_preferences');
/** *  On load, called to load the auth2 library and API client library. */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}
/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
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
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    createEventButton.onclick = handleCreateClick;
    adjustPreferencesButton.onclick = handlePreferences;
    // createEventButton.onclick = handleCreateEvent;
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
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    createEventButton.style.display = 'block';
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    createEventButton.style.display = 'none';
  }
}
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
  location.reload();
}
function handleCreateEvent(event) {
  location.replace('createNewEvent.html');
}
function handlePreferences(event) {
  location.replace('adjustPreferences.html');
}

var dict = new Object();

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message, listItem) {
  if (listItem) {
    var node = document.createElement("LI");
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    node.append(textContent);
    pre.appendChild(node);
  } else {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }
}

function listUpcomingEvents() {
  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }
  var date = new Date();
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (date).toISOString(),
    'timeMax': (date.addDays(7)).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'orderBy': 'startTime',
  }).then(function(response) {
    var events = response.result.items;
    appendPre('Your events this week:', false);
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        var duration = (new Date(event.end.dateTime).getTime()) - (new Date(event.start.dateTime).getTime());
        if (!when) {
          when = event.start.date;
        }
        appendPre(event.summary + ' (' + when + ')', true);
        console.log(duration);
        if (event.description) {
          var ed = event.description;
          if (ed in dict) {
            dict[ed] += duration;
          } else {
            dict[ed] = duration;
          }
        }
      }
    } else {
      appendPre('No upcoming events found. Maybe plan out your week?', false);
    }
    console.log(dict);
  });

  return true;
}

function getValue() {
  var x = document.getElementById("event");
  var title = x.elements[0].value;
  var startDate = x.elements[1].value;
  var startTime = x.elements[2].value;
  var endDate = x.elements[3].value;
  var endTime = x.elements[4].value;
  var categories = x.elements[5].value.split(",");
  var txt = "";
  for (i = 0; i < x.length; i++) {
    txt = txt + x.elements[i].value + "\n";
  }
  document.getElementById("demo").innerHTML = txt;
  location.replace("formComplete.html");
}

function handleCreateClick() {
  gapi.client.load('calendar', 'v3', insertEvent);
}

function insertEvent() {
//   var event = {
//   "summary": "Appointment",
//   "start": {
//     "dateTime": "2020-02-16T10:00:00.000-07:00"
//   },
//   "end": {
//     "dateTime": "2020-02-16T10:25:00.000-07:00"
//   }
// };
// var request = gapi.client.calendar.events.insert({
//   'calendarId': 'primary',
//   'resource': event
// });
// request.execute(function(event) {
//   appendPre('Event created: ' + event.data.htmlLink);
// });
var event = {
  'summary': 'Google I/O 2015',
  'location': '800 Howard St., San Francisco, CA 94103',
  'description': 'A chance to hear more about Google\'s developer products.',
  'start': {
    'dateTime': '2020-05-28T09:00:00-07:00',
    'timeZone': 'America/New_York'
  },
  'end': {
    'dateTime': '2020-05-28T17:00:00-07:00',
    'timeZone': 'America/New_York'
  },
};
var request = gapi.client.calendar.events.insert({
  'calendarId': 'primary',
  'resource': event
});
request.execute(function(event) {
  appendPre('Event created: ' + event.htmlLink);
  alert('event added');
});

  // var x = document.getElementById("event");
  // var title = x.elements[0].value;
  // var startDate = x.elements[1].value;
  // var startTime = x.elements[2].value;
  // var endDate = x.elements[3].value;
  // var endTime = x.elements[4].value;
  // var categories = x.elements[5].value.split(",");
  // var txt = "";
  // for (i = 0; i < x.length; i++) {
  //   txt = txt + x.elements[i].value + "\n";
  // }
  document.getElementById("demo").innerHTML = "done";
}

function goHome() {
    location.replace('quickstart.html');
}

//
// function todo() {
//   let categories = [];
//
//   function addCat(text) {
//     const cat = {
//       text,
//       id: text
//     };
//     categories.push(cat)
//     document.getElementById("demo").innerHTML = categories;
//   }
//
//   const form = document.querySelector('.js-form');
//   form.addEventListener('submit', event => {
//     event.preventDefault();
//     const input = document.querySelector('.js-todo-input');
//
//     const text = input.value.trim();
//     if (text !== '') {
//       addCat(text);
//       input.value = '';
//       input.focus();
//     }
//   });
// }
