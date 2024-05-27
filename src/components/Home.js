import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const styles = {
    container: {
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    },
    CollegeTitle: {
      marginTop: '20px',
    },
    subTitle: {
      color: '#666',
      marginTop: '10px',
    },
    guideTitle: {
      marginTop: '20px',
    },
    teamTitle: {
      marginTop: '20px',
    },
    teamMember: {
      color: '#444',
    },
    button: {
      marginTop: '20px',
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    buttonLink: {
      textDecoration: 'none',
    },
  };

  return (
    <div className="Home" style={styles.container}>
      <h1 style={styles.title}>R.L.Jalappa Institute of Technology</h1>
      <h2 style={styles.teamTitle}>
        Title
        <p>Automated DevOps Pipeline for Deploying MERN Stack Web Application in Kubernetes on AWS</p>
      </h2>
      <h1 style={styles.guideTitle}>Guide Name:</h1>
      <h3>Dr. Mahalakshmi Shetty</h3>
      <h1 style={styles.teamTitle}>Team Mates:</h1>
      <h3 style={styles.teamMember}>Ranjithkumar T R</h3>
      <h3 style={styles.teamMember}>S Rekha</h3>
      <h3 style={styles.teamMember}>Sahitya Nandaluru</h3>
      <h3 style={styles.teamMember}>Satya Tulasi Jalandhar C H</h3>
      <Link to="/Todo" style={styles.buttonLink}>
        <button style={styles.button}>Go to Another Page</button>
      </Link>
    </div>
  );
}

export default Home;
