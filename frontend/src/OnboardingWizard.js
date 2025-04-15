import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({});
  const [config, setConfig] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/admin/config')
      .then(res => {
        const grouped = res.data.reduce((acc, curr) => {
          if (!acc[curr.page]) acc[curr.page] = [];
          acc[curr.page].push(curr.component);
          return acc;
        }, {});
        setConfig(grouped);
      });
  }, []);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    const payload = {
      email,
      password,
      ...formData
    };
    axios.post('http://localhost:5000/submit-step', payload)
      .then(() => navigate('/data'));
  };

  const renderFields = () => {
    if (step === 1) {
      return (
        <>
          <label>Email:<input type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label>Password:<input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
        </>
      );
    }

    const fields = config[step] || [];
    return fields.map(component => {
      switch (component) {
        case 'about_me':
          return (
            <label key="about_me">About Me:
              <textarea onChange={e => setFormData({ ...formData, about_me: e.target.value })} />
            </label>
          );
        case 'address':
          return (
            <div key="address">
              <label>Street:<input onChange={e => setFormData({ ...formData, street: e.target.value })} /></label>
              <label>City:<input onChange={e => setFormData({ ...formData, city: e.target.value })} /></label>
              <label>State:<input onChange={e => setFormData({ ...formData, state: e.target.value })} /></label>
              <label>Zip:<input onChange={e => setFormData({ ...formData, zip: e.target.value })} /></label>
            </div>
          );
        case 'birthdate':
          return (
            <label key="birthdate">Birthdate:
              <input type="date" onChange={e => setFormData({ ...formData, birthdate: e.target.value })} />
            </label>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div>
      <h2>Step {step} of 3</h2>
      {renderFields()}
      <div>
        {step > 1 && <button onClick={handleBack}>Back</button>}
        {step < 3 && <button onClick={handleNext}>Next</button>}
        {step === 3 && <button onClick={handleSubmit}>Submit</button>}
      </div>
    </div>
  );
};

export default OnboardingWizard;