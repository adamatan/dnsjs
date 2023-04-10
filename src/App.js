import React, { useState, useEffect } from 'react';
import useDebounce from './useDebounce';
import './App.css';

function App() {
  const [domainName, setDomainName] = useState('');
  const [dnsResponses, setDnsResponses] = useState({});
  const debouncedDomainName = useDebounce(domainName, 300);

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

  const hasSpfRecord = () => {
    const txtRecords = dnsResponses['TXT'] && dnsResponses['TXT'].Answer;
    if (!txtRecords) return false;

    return txtRecords.some(record => record.data.startsWith('v=spf1'));
  };

  const handleClick = async (event) => {
    event.preventDefault();
    if (isValidDomain(domainName)) {
      const types = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SOA', 'TXT'];
      const requests = types.map(type => handleResolve(type));
      await Promise.all(requests);
    }
  };

  const isValidDomain = (domain) => {
    return domain.includes('.') && domain.split('.').every(part => part.length > 0);
  };

  useEffect(() => {
    if (isValidDomain(debouncedDomainName)) {
      handleClick({ preventDefault: () => {} });
    }
  }, [debouncedDomainName]);

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
      <form onSubmit={handleClick} className="input-container">
        <input
          type="text"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
          placeholder="Enter a domain name"
          className="input-field"
        />
        <button type="submit" className="resolve-button">
          Resolve DNS
        </button>
      </form>
      {renderDnsTable()}
      {hasSpfRecord() && (
        <p className="spf-message">
          This site uses SPF (Sender Policy Framework) for email authentication.
        </p>
      )}
    </div>
  );
}

export default App;
