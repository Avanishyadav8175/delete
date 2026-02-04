import React, { useState, useEffect } from 'react';

const ErrorPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 3 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 2000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
     

      {/* Error Section */}
      <div style={{ marginTop: '50px', padding: '20px', backgroundColor: '#F8F9FA', borderRadius: '10px', display: 'inline-block' }}>
        <div style={{ fontSize: '50px', color: 'red' }}>❌</div>
        <h2 style={{ color: 'red', margin: '20px 0' }}>Something Went Wrong</h2>
        <p style={{ color: '#6c757d', margin: '10px 0' }}>
          We're sorry, but your request couldn't be processed at the moment.
        </p>
        <p style={{ color: '#6c757d', margin: '10px 0' }}>
          Please try again after: <span style={{ fontWeight: 'bold' }}>{formatTime(timeLeft)}</span>
        </p>
        <button
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#ae265f',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => window.location.href = '/card-details'}
        > Back
          
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;