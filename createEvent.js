function getValue() {
  // location.replace('quickstart.html');
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
}
function handleAuthClick() {
  var event = {
    'summary': 'Google I/O 2020',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': '2020-02-29T21:00:00-07:00',
    },
    'end': {
      'dateTime': '2020-02-29T22:00:00-07:00',
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10}
      ]
    }
  };

  var request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });

  request.execute(function(event) {
    appendPre('Event created: ' + event.htmlLink);
  });
}
