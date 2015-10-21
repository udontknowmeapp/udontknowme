export function getSocketUri() {
  const loc = window.location;
  let socketUri;

  if (loc.protocol === 'https:') {
    socketUri = 'wss://';
  } else {
    socketUri = 'ws://';
  }

  if (process.env.NODE_ENV === 'production') {
    socketUri += `${loc.host}/play`;
  } else {
    socketUri += `${loc.hostname}:8000/play`;
  }

  return socketUri;
}
