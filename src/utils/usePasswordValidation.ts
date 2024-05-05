import {useState, useEffect} from 'react';

interface Props {
  password: string;
  confirmPassword: string;
  requiredLength: number;
}

export const usePasswordValidation = ({
  password,
  confirmPassword,
  requiredLength,
}: Props) => {
  const [validLength, setValidLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [upperCase, setUpperCase] = useState(false);
  const [lowerCase, setLowerCase] = useState(false);
  const [specialChar, setSpecialChar] = useState(false);
  const [match, setMatch] = useState(false);

  useEffect(() => {
    setValidLength(password?.length >= requiredLength ? true : false);
    setUpperCase(password?.toLowerCase() !== password);
    setLowerCase(password?.toUpperCase() !== password);
    setHasNumber(/\d/.test(password));
    setMatch(password === confirmPassword);
    setSpecialChar(/[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(password));
  }, [password, confirmPassword, requiredLength]);

  return [validLength, hasNumber, upperCase, lowerCase, match, specialChar];
};
