import React, { useState, useEffect, useCallback } from 'react';
import DnsTable from './components/DnsTable';
import { domainNameIsValid } from './utils/domainNameValidator';
import { getRandomDomain } from './utils/domains';
import { useDebounce } from './hooks/useDebounce';

import './App.css';

function App() {
  const [domainName, setDomainName] = useState(getRandomDomain());
  const debouncedDomain = useDebounce(domainName, 300);
  const [dnsResponses, setDnsResponses] = useState({});

  const handleResolve = useCallback(
    async (type) => {
      try {
        const response = await fetch(`https://dns.google/resolve?name=${domainName}&type=${type}`);
        const data = await response.json();
        setDnsResponses((prevState) => ({
          ...prevState,
          [type]: data,
        }));
      } catch (error) {
        console.error(error);
      }
    },
    [domainName]
  );

  const handleClick = useCallback(async () => {
    const recordTypes = [
      'A',        'NS',         'MD',    'MF',
      'CNAME',    'SOA',        'MB',    'MG',
      'MR',       'NULL',       'WKS',   'PTR',
      'HINFO',    'MINFO',      'MX',    'TXT',
      'RP',       'SIG',        'KEY',   'AAAA',
      'SRV',      'NAPTR',      'CERT',  'A6',
      'DNAME',    'OPT',        'DS',    'SSHFP',
      'IPSECKEY', 'RRSIG',      'NSEC',  'DNSKEY',
      'NSEC3',    'NSEC3PARAM', 'TLSA',  'CDS',
      'CDNSKEY',  'SVCB',       'HTTPS', 'SPF',
      'TSIG',     'IXFR',       'AXFR',  'MAILB',
      'CAA'
    ];

    const requests = recordTypes.map((type) => handleResolve(type));
    await Promise.all(requests);
  }, [handleResolve]);

  useEffect(() => {
    if (domainNameIsValid(debouncedDomain)) {
      handleClick();
    }
  }, [debouncedDomain, handleClick]);

  const hasSpfRecord = (dnsResponses) => {
    const txtRecords = dnsResponses.TXT?.Answer || [];
    return txtRecords.some((record) => record.data.startsWith('v=spf1'));
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
        <button onClick={handleClick} className="resolve-button">
          Resolve DNS
        </button>
      </div>
      <DnsTable dnsResponses={dnsResponses} />
      {hasSpfRecord(dnsResponses) && (
        <p className="spf-message">This site uses SPF (Sender Policy Framework).</p>
      )}
      <div className="commit-hash">
        <small>Commit hash: {process.env.REACT_APP_COMMIT_HASH}</small>
      </div>
    </div>
  );
  }

export default App;
