/* eslint-disable react/display-name */
import React, { FunctionComponent } from 'react';
import { ConfigContext } from './context';
import { getGlobalConfig } from './index';

const GlobalConfigProvider: FunctionComponent = ({ children }) => {
  const globalConfig = getGlobalConfig();

  return (
    (globalConfig && (
      <ConfigContext.Provider value={globalConfig}>{children}</ConfigContext.Provider>
    )) || <>{children}</>
  );
};

export default GlobalConfigProvider;
