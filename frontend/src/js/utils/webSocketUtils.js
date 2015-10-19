export function getSocketUri() {
  const loc = window.location;
  let socketUri;

  if (loc.protocol === 'https:') {
    socketUri = 'wss://';
  } else {
    socketUri = 'ws://';
  }

  socketUri += `${loc.host}/play`;
  return socketUri;
}
