import React from 'react';

const LiveResultsContainer = ({ className, name, content, testHandle }) => {
  return (
    <span test-handle={testHandle}>
      {name}:&nbsp;
      <span className={className}>{content}</span>
    </span>
  );
};

export default LiveResultsContainer;
