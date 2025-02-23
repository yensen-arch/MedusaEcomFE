export const getOptimizedImageUrl = (url, width = 800) => {
  if (!url?.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},c_limit,f_auto,q_auto:best,dpr_auto,fl_progressive:steep/`);
};