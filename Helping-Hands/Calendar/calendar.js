// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the calendar
    const calendar = document.getElementById('calendar');
    const calendarEl = document.createElement('div');
    calendarEl.className = 'calendar-container';
    calendar.appendChild(calendarEl);

    // Add an event (basic example)
    document.getElementById('add-event-button').addEventListener('click', function() {
        const eventDate = prompt('Enter the event date (YYYY-MM-DD):');
        if (eventDate) {
            const event = document.createElement('div');
            event.className = 'event';
            event.innerText = `Event on ${eventDate}`;
            calendarEl.appendChild(event);
        }
    });

    // Notification subscription
    document.getElementById('subscribe-button').addEventListener('click', function() {
        const email = document.getElementById('notification-email').value;
        if (email) {
            alert(`You have subscribed for notifications with the email ${email}`);
            // Here you can add logic to send notification emails
        } else {
            alert('Please enter an email address.');
        }
    });
});
