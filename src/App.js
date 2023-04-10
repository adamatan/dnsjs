import React, { useState } from 'react';
import './App.css';

function App() {
  const [domainName, setDomainName] = useState('');
  const [dnsResponses, setDnsResponses] = useState({});

  const handleResolve = async (type) => {
    try {
      const response = await fetch(`https://dns.google/resolve?name=${domainName}&type=${type}`);
      const data = await response.json();
      setDnsResponses(prevState => ({
        ...prevState,
        [type]: data
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = async () => {
    const types = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SOA', 'TXT'];
    const requests = types.map(type => handleResolve(type));
    await Promise.all(requests);
  };

  const formatDnsResponse = (data) => {
    if (!data) return [];
    if (data.Answer) return data.Answer;
    if (data.Authority) return data.Authority;
    if (data.Additional) return data.Additional;
    return [];
  };

  const renderDnsTable = () => {
    const types = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SOA', 'TXT'];
    const headers = ['Type', 'Name', 'Value', 'TTL', 'Class'];
    const rows = types.flatMap(type => {
      const data = formatDnsResponse(dnsResponses[type]);
      return data.map(record => ({
        type,
        name: record.name,
        value: record.data,
        ttl: record.TTL,
        class: record.class
      }));
    });
    return (
      <table className="dns-table">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row.type}</td>
              <td>{row.name}</td>
              <td>{row.value}</td>
              <td>{row.ttl}</td>
              <td>{row.class}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="App">
      <h1>DNS Resolver</h1>
      <div className="input-container">
        <input
          type="text"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
          placeholder="Enter a domain name"
          className="input-field"
        />
        <button onClick={handleClick} className="resolve-button">Resolve DNS</button>
      </div>
      {renderDnsTable()}
    </div>
  );
}

export default App;
