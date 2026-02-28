'use client';

export default function ProfileImage({ src, alt = "", className = "" }) {
  const defaultImage = "/images/user-icon-dark.png";
  
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
