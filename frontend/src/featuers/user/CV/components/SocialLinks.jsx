import React from 'react';

const SocialLinks = ({ formData, className = "" }) => {
  const { linkedin, github, website, extraLinks = [] } = formData || {};

  const formatUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <div className={`social-links ${className}`}>
      {/* LinkedIn */}
      {linkedin && (
        <div className="social-link-item">
          <a 
            href={formatUrl(linkedin)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            LinkedIn: {linkedin}
          </a>
        </div>
      )}

      {/* GitHub */}
      {github && (
        <div className="social-link-item">
          <a 
            href={formatUrl(github)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub: {github}
          </a>
        </div>
      )}

      {/* Website */}
      {website && (
        <div className="social-link-item">
          <a 
            href={formatUrl(website)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Website: {website}
          </a>
        </div>
      )}

      {/* Extra Links */}
      {extraLinks?.map((link, index) => (
        link.label && link.url && link.label !== "Enter Platform" && (
          <div key={index} className="social-link-item">
            <a 
              href={formatUrl(link.url)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {link.label}: {link.url}
            </a>
          </div>
        )
      ))}
    </div>
  );
};

export default SocialLinks;
