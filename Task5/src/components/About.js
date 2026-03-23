import React from 'react';

function About() {
  return (
    <section className="page-section">
      <h1>About This Application</h1>
      <p>
        This is a Task 5 React application that showcases essential React and React Router concepts.
      </p>
      <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem', color: '#333' }}>
        Key Features:
      </h2>
      <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
        <li>
          <strong>Client-Side Routing:</strong> Uses React Router DOM to manage navigation without page reloads
        </li>
        <li>
          <strong>Component-Based:</strong> Each page is a separate React component
        </li>
        <li>
          <strong>State Management:</strong> The Contact page uses React hooks (useState) for form state
        </li>
        <li>
          <strong>Controlled Forms:</strong> Form inputs are controlled components that update state
        </li>
        <li>
          <strong>Responsive Design:</strong> The application is styled for different screen sizes
        </li>
      </ul>
      <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.3rem', color: '#333' }}>
        Technologies Used:
      </h2>
      <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
        <li>React 18.2</li>
        <li>React Router DOM 6</li>
        <li>CSS for styling</li>
      </ul>
    </section>
  );
}

export default About;
