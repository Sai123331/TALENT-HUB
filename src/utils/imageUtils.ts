export const getImageUrl = (path: string | undefined | null, type: 'user' | 'company' = 'user') => {
  if (!path) {
    return type === 'user' 
      ? 'https://cdn-icons-png.flaticon.com/512/149/149071.png' 
      : 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&h=128&fit=crop';
  }

  if (path.startsWith('http')) {
    return path;
  }

  // Prepend backend URL for local paths
  return `http://localhost:5000${path.startsWith('/') ? '' : '/'}${path}`;
};
