export const domainNameIsValid = (domainName) => {
    const regex = /^(?=.{4,253}$)([a-zA-Z0-9-_]{1,63}\.){1,127}[a-zA-Z0-9-_]{1,63}$/;
    return regex.test(domainName);
  };
