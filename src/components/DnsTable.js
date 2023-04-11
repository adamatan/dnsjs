import React from 'react';

const DnsTable = ({ dnsResponses }) => {
  const formatDnsResponse = (data) => {
    if (!data) return [];
    if (data.Answer) return data.Answer;
    if (data.Authority) return data.Authority;
    if (data.Additional) return data.Additional;
    return [];
  };

  const renderTableRows = (type) => {
    const records = formatDnsResponse(dnsResponses[type]);
    return records.map((record, index) => (
      <tr key={index}>
        <td>{record.name}</td>
        <td>{record.type}</td>
        <td>{record.TTL}</td>
        <td>{record.data}</td>
      </tr>
    ));
  };

  const types = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SOA', 'TXT'];
  return (
    <table className="dns-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>TTL</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        {types.map((type) => (
          <React.Fragment key={type}>{renderTableRows(type)}</React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default DnsTable;

