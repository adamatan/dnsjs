import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const getRandomDomain = () => {
    const domains = [
      'apple.com',
      'amazon.com',
      'microsoft.com',
      'alphabet.com',
      'facebook.com',
      'tesla.com',
      'nvidia.com',
      'paypal.com',
      'netflix.com',
      'salesforce.com',
      'walmart.com',
      'berkshirehathaway.com',
      'jpmorganchase.com',
      'johnsonandjohnson.com',
      'visa.com',
      'mastercard.com',
      'procterandgamble.com',
      'unitedhealthgroup.com',
      'home-depot.com',
      'intel.com',
      'verizon.com',
      'att.com',
      'cisco.com',
      'abbott.com',
      'disney.com',
      'comcast.com',
      'boeing.com',
      'cocacola.com',
      'pepsico.com',
      'pfizer.com',
      'merck.com',
      'abbvie.com',
      'eli-lilly.com',
      'amgen.com',
      'bristol-myers-squibb.com',
      'gilead.com',
      'goldmansachs.com',
      'lockheedmartin.com',
      '3m.com',
      'caterpillar.com',
      'exxonmobil.com',
      'chevron.com',
      'generalelectric.com',
      'honeywell.com',
      'dupont.com',
      'ibm.com',
      'oracle.com',
      'dow.com',
      'fedex.com',
      'ups.com',
    ];

    const randomIndex = Math.floor(Math.random() * domains.length);
    return domains[randomIndex];
  };

  const [domainName, setDomainName] = useState(getRandomDomain());
  const [dnsResponses, setDnsResponses] = useState({});

  useEffect(() => {
    if (domainName) {
      handleClick();
    }
  }, []);

  const hasSpfRecord = (dnsResponses) => {
    const txtRecords = dnsResponses.TXT?.Answer || [];
    return txtRecords.some((record) => record.data.startsWith('v=spf1'));
  };


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

  const handleInputClick = () => {
    setDomainName('');
  };

  return (
    <div className="App">
      <h1>DNS Resolver</h1>
      <div className="input-container">
        <input
          type="text"
          value={domainName}
          onClick={handleInputClick}
          onChange={(e) => setDomainName(e.target.value)}
          placeholder="Enter a domain name"
          className="input-field"
        />
        <button onClick={handleClick} className="resolve-button">Resolve DNS</button>
      </div>
      {renderDnsTable()}
      {hasSpfRecord(dnsResponses) && (
        <p className="spf-message">This site uses SPF (Sender Policy Framework).</p>
      )}
    </div>
  );
}

export default App;
