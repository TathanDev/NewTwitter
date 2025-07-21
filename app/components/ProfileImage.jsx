'use client';

export default function ProfileImage({ src, alt = "", className = "" }) {
  const defaultImage = "/users_pfp/1752950264309-archlinux-btw.png";
  
  const handleError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <img
      alt={alt}
      src={src || defaultImage}
      className={className}
      onError={handleError}
    />
  );
}
