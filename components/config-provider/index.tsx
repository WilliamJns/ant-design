// TODO: remove this lint
// SFC has specified a displayName, but not worked.
/* eslint-disable react/display-name */
import * as React from 'react';
import message from '../message';
import notification from '../notification';
import modal from '../modal';
import { RenderEmptyHandler } from './renderEmpty';
import LocaleProvider, { Locale, ANT_MARK } from '../locale-provider';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { ConfigConsumer, ConfigContext, CSPConfig, ConfigConsumerProps } from './context';

export { RenderEmptyHandler, ConfigConsumer, CSPConfig, ConfigConsumerProps };

export const configConsumerProps = [
  'getPopupContainer',
  'rootPrefixCls',
  'getPrefixCls',
  'renderEmpty',
  'csp',
  'autoInsertSpaceInButton',
  'locale',
  'pageHeader',
];

export interface ConfigProviderProps {
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  prefixCls?: string;
  children?: React.ReactNode;
  renderEmpty?: RenderEmptyHandler;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
  locale?: Locale;
  pageHeader?: {
    ghost: boolean;
  };
}

let globalConfig: ConfigConsumerProps;

export function getGlobalConfig(): ConfigConsumerProps {
  return globalConfig;
}

class ConfigProvider extends React.Component<ConfigProviderProps> {
  getPrefixCls = (suffixCls: string, customizePrefixCls?: string) => {
    const { prefixCls = 'ant' } = this.props;

    if (customizePrefixCls) return customizePrefixCls;

    return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
  };

  renderProvider = (context: ConfigConsumerProps, legacyLocale: Locale) => {
    const {
      children,
      getPopupContainer,
      renderEmpty,
      csp,
      autoInsertSpaceInButton,
      locale,
      pageHeader,
      prefixCls,
    } = this.props;

    const config: ConfigConsumerProps = {
      ...context,
      getPrefixCls: this.getPrefixCls,
      csp,
      autoInsertSpaceInButton,
    };

    if (getPopupContainer) {
      config.getPopupContainer = getPopupContainer;
    }

    if (renderEmpty) {
      config.renderEmpty = renderEmpty;
    }

    if (pageHeader) {
      config.pageHeader = pageHeader;
    }

    globalConfig = config;

    if (prefixCls !== undefined) {
      notification.config({
        prefixCls: `${prefixCls}-notification`,
      });
      message.config({
        prefixCls: `${prefixCls}-message`,
      });
      modal.config({
        prefixCls: `${prefixCls}-modal`,
      });
    }

    return (
      <ConfigContext.Provider value={config}>
        <LocaleProvider locale={locale || legacyLocale} _ANT_MARK__={ANT_MARK}>
          {children}
        </LocaleProvider>
      </ConfigContext.Provider>
    );
  };

  render() {
    return (
      <LocaleReceiver>
        {(_, __, legacyLocale) => (
          <ConfigConsumer>
            {context => this.renderProvider(context, legacyLocale as Locale)}
          </ConfigConsumer>
        )}
      </LocaleReceiver>
    );
  }
}

export default ConfigProvider;
