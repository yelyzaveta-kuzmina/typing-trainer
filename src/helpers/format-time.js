export const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
};
