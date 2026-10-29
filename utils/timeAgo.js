export default function timeAgo(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return '';

  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  const sameYear = d.getFullYear() === now.getFullYear();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day = String(d.getDate()).padStart(2, '0');

  if (sameYear) {
    return `${day} ${months[d.getMonth()]}`; // e.g. "15 Jun"
  }

  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`; // e.g. "15 Jun 2023"
}