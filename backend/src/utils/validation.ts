export const validateUniversityEmail = (email: string): boolean => {
  const universityDomains = ['.edu', '.ac.', 'university', 'college'];
  return universityDomains.some(domain => email.toLowerCase().includes(domain));
};

export const containsProfanity = (text: string): boolean => {
  const profanityList = ['spam', 'scam', 'fake', 'fraud'];
  const lowerText = text.toLowerCase();
  return profanityList.some(word => lowerText.includes(word));
};

export const validatePrice = (price: number): boolean => {
  return price >= 0 && price <= 100000;
};
