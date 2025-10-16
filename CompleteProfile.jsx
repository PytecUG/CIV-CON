import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    region: '',
    district: '',
    county: '',
    subCounty: '',
    parish: '',
    village: '',
    interests: [],
    occupation: '',
    bio: '',
    politicalInterest: '',
    communityRole: '',
    notifications: { email: true, sms: false, push: true }
  });
  const [districts, setDistricts] = useState([]);
  const [counties, setCounties] = useState([]);
  const [subCounties, setSubCounties] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/locations/districts')
      .then(response => setDistricts(response.data))
      .catch(error => console.error('Error fetching districts:', error));
  }, []);

  const handleDistrictChange = async (districtId) => {
    setFormData({ ...formData, district: districtId, county: '', subCounty: '', parish: '', village: '' });
    setCounties([]);
    setSubCounties([]);
    setParishes([]);
    setVillages([]);
    if (districtId) {
      try {
        const response = await axios.get(`http://localhost:8000/locations/counties/${districtId}`);
        setCounties(response.data);
      } catch (error) {
        console.error('Error fetching counties:', error);
      }
    }
  };

  const handleCountyChange = async (countyId) => {
    setFormData({ ...formData, county: countyId, subCounty: '', parish: '', village: '' });
    setSubCounties([]);
    setParishes([]);
    setVillages([]);
    if (countyId) {
      try {
        const response = await axios.get(`http://localhost:8000/locations/sub-counties/${countyId}`);
        setSubCounties(response.data);
      } catch (error) {
        console.error('Error fetching sub-counties:', error);
      }
    }
  };

  const handleSubCountyChange = async (subCountyId) => {
    setFormData({ ...formData, subCounty: subCountyId, parish: '', village: '' });
    setParishes([]);
    setVillages([]);
    if (subCountyId) {
      try {
        const response = await axios.get(`http://localhost:8000/locations/parishes/${subCountyId}`);
        setParishes(response.data);
      } catch (error) {
        console.error('Error fetching parishes:', error);
      }
    }
  };

  const handleParishChange = async (parishId) => {
    setFormData({ ...formData, parish: parishId, village: '' });
    setVillages([]);
    if (parishId) {
      try {
        const response = await axios.get(`http://localhost:8000/locations/villages/${parishId}`);
        setVillages(response.data);
      } catch (error) {
        console.error('Error fetching villages:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:8000/auth/complete-profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Profile completed:', response.data);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Profile update failed:', error.response?.data?.detail || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={formData.region} onChange={e => setFormData({ ...formData, region: e.target.value })} placeholder="Region" />
      <select value={formData.district} onChange={e => handleDistrictChange(e.target.value)}>
        <option value="">Select District</option>
        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>
      <select value={formData.county} onChange={e => handleCountyChange(e.target.value)} disabled={!formData.district}>
        <option value="">Select County</option>
        {counties.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <select value={formData.subCounty} onChange={e => handleSubCountyChange(e.target.value)} disabled={!formData.county}>
        <option value="">Select Sub-County</option>
        {subCounties.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
      </select>
      <select value={formData.parish} onChange={e => handleParishChange(e.target.value)} disabled={!formData.subCounty}>
        <option value="">Select Parish</option>
        {parishes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <select value={formData.village} onChange={e => setFormData({ ...formData, village: e.target.value })} disabled={!formData.parish}>
        <option value="">Select Village</option>
        {villages.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
      </select>
      <input type="text" value={formData.occupation} onChange={e => setFormData({ ...formData, occupation: e.target.value })} placeholder="Occupation" />
      <input type="text" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} placeholder="Bio" />
      <input type="text" value={formData.politicalInterest} onChange={e => setFormData({ ...formData, politicalInterest: e.target.value })} placeholder="Political Interest" />
      <input type="text" value={formData.communityRole} onChange={e => setFormData({ ...formData, communityRole: e.target.value })} placeholder="Community Role" />
      <button type="submit">Complete Profile</button>
    </form>
  );
};

export default CompleteProfile;