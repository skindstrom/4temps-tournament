// @flow

const validateEmail = (email: string): boolean => {
  // http://emailregex.com/
  // eslint-disable-next-line max-len
  return (
    -1 !==
    email.search(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  );
};

export default validateEmail;
