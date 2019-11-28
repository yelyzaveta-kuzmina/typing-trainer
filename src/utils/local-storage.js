export const getResults = () => {
  const json = localStorage.getItem('results');
  if (!json) {
    return [];
  }
  return JSON.parse(json);
};

export const addResult = (result) => {
  const results = getResults();
  const newResults = [...results, result];
  localStorage.setItem('results', JSON.stringify(newResults));
};

export const removeResults = (result) => localStorage.removeItem('results');
