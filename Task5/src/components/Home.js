import React from 'react';

function Home() {
  return (
    <section className="page-section">
      <h1>Welcome to Task 5!</h1>
      <p>
        This is a React Router application that demonstrates client-side routing without page reloads.
      </p>
      <p>
        Navigate through the different pages using the navigation bar at the top:
      </p>
      <ul style={{ marginLeft: '1.5rem', marginTop: '1rem', lineHeight: '1.8' }}>
        <li><strong>Home:</strong> A simple welcome message (you are here)</li>
        <li><strong>About:</strong> Information about this application</li>
        <li><strong>Contact:</strong> A form to submit your information</li>
      </ul>
      <p style={{ marginTop: '1.5rem' }}>
        This demonstrates the power of React Router for creating single-page applications (SPAs) 
        with smooth navigation and state management.
      </p>
    </section>
  );
}

export default Home;
