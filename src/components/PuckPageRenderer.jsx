import React from 'react';
import { Render } from '@puckeditor/core';
import puckConfig from '../features/cms/puck-config';

const PuckPageRenderer = ({ data }) => {
  if (!data || !data.content) {
    return null;
  }

  return <Render config={puckConfig} data={data} />;
};

export default PuckPageRenderer;
