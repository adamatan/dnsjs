export const getRandomDomain = () => {
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
