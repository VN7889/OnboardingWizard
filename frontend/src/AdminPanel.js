import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [config, setConfig] = useState({});

  const components = ['about_me', 'address', 'birthdate'];

  useEffect(() => {
    axios.get('http://localhost:5000/admin/config').then(res => {
      const newConfig = {};
      res.data.forEach(item => {
        if (!newConfig[item.page]) newConfig[item.page] = [];
        newConfig[item.page].push(item.component);
      });
      setConfig(newConfig);
    });
  }, []);

  const handleCheckboxChange = (page, component) => {
    const updatedPage = config[page] || [];
    if (updatedPage.includes(component)) {
      setConfig({
        ...config,
        [page]: updatedPage.filter(c => c !== component)
      });
    } else {
      setConfig({
        ...config,
        [page]: [...updatedPage, component]
      });
    }
  };

  const saveConfig = () => {
    axios.post('http://localhost:5000/admin/config', config)
      .then(() => alert('Configuration saved!'))
      .catch(() => alert('Error saving config.'));
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      {[2, 3].map(page => (
        <div key={page}>
          <h4>Page {page}</h4>
          {components.map(component => (
            <div key={component}>
              <label>
                <input
                  type="checkbox"
                  checked={config[page]?.includes(component) || false}
                  onChange={() => handleCheckboxChange(page, component)}
                />
                {component.replace('_', ' ').toUpperCase()}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={saveConfig}>Save Configuration</button>
    </div>
  );
};

export default AdminPanel;