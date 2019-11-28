import React from 'react';

const LiveResultsContainer = ({ className, name, content }) => {
  return (
    <span>
      {name}:&nbsp;<span className={className}>{content}</span>
    </span>
  );
};

export default LiveResultsContainer;
