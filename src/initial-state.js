import { getResults } from './utils/local-storage';

export const INITIAL_STATE = {
  poemNumber: 0,
  textNumber: 0,
  activeCharachterIndex: 0,
  time: 0,
  countErrors: 0,
  isModalVisible: false,
  errorsIndices: [],
  results: getResults()
};
