const recordTypes = [
    "A",
    "NS",
    "MD",
    "MF",
    "CNAME",
    "SOA",
    "MB",
    "MG",
    "MR",
    "NULL",
    "WKS",
    "PTR",
    "HINFO",
    "MINFO",
    "MX",
    "TXT",
    "RP",
    "AFSDB",
    "X25",
    "ISDN",
    "RT",
    "NSAP",
    "NSAP-PTR",
    "SIG",
    "KEY",
    "PX",
    "GPOS",
    "AAAA",
    "LOC",
    "NXT",
    "EID",
    "NIMLOC",
    "SRV",
    "ATMA",
    "NAPTR",
    "KX",
    "CERT",
    "A6",
    "DNAME",
    "SINK",
    "OPT",
    "APL",
    "DS",
    "SSHFP",
    "IPSECKEY",
    "RRSIG",
    "NSEC",
    "DNSKEY",
    "DHCID",
    "NSEC3",
    "NSEC3PARAM",
    "TLSA",
    "SMIMEA",
    "Unassigned",
    "HIP",
    "NINFO",
    "RKEY",
    "TALINK",
    "CDS",
    "CDNSKEY",
    "OPENPGPKEY",
    "CSYNC",
    "ZONEMD",
    "SVCB",
    "HTTPS",
    "Unassigned",
    "SPF",
    "UINFO",
    "UID",
    "GID",
    "UNSPEC",
    "NID",
    "L32",
    "L64",
    "LP",
    "EUI48",
    "EUI64",
    "TKEY",
    "TSIG",
    "IXFR",
    "AXFR",
    "MAILB",
    "MAILA",
    "URI",
    "CAA",
    "AVC",
    "DOA",
    "AMTRELAY",
    "TA",
    "DLV",
  ];


const https = require('https');

const requestType = async (type) => {
  return new Promise((resolve, reject) => {
    const req = https.get(`https://dns.google/resolve?name=horse.com&type=${type}`, (res) => {
      if (res.statusCode === 200) {
        res.on('data', (chunk) => {
          const data = JSON.parse(chunk);
          if (data.Question && data.Question[0]) {
            resolve({ supported: true, code: data.Question[0].type });
          } else {
            console.error(`Error: Invalid response format for record type "${type}". 'Question' property is missing.`);
            resolve({ supported: false });
          }
        });
      } else if (res.statusCode === 400) {
        resolve({ supported: false });
      } else {
        reject(new Error(`Unexpected status code: ${res.statusCode}`));
      }
      res.resume();
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

const showProgress = (current, total) => {
  const progressBarLength = 50;
  const progress = Math.round((current / total) * progressBarLength);
  const progressBar = '='.repeat(progress) + ' '.repeat(progressBarLength - progress);
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`[${progressBar}] (${current}/${total})`);
};

const checkRecordTypes = async () => {
  const types = {};

  for (const [index, type] of recordTypes.entries()) {
    try {
      const result = await requestType(type);
      if (result.supported) {
        types[type] = result.code;
      }
    } catch (error) {
      console.error(`Error checking record type "${type}":`, error);
    }
    showProgress(index + 1, recordTypes.length);
  }
  console.log('\n\nNumerical Types:', types);
};

checkRecordTypes();
