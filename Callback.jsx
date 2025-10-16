import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      if (code) {
        const provider = location.pathname.includes('google') ? 'google' : 'linkedin';
        try {
          const response = await axios.get(`http://localhost:8000/auth/${provider}/callback?code=${code}`);
          if (response.status === 200) {
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            navigate('/complete-profile'); // Redirect to complete profile
          } else {
            console.error('Social login failed');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    handleCallback();
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default Callback;