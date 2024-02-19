import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '聪ζ';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'github',
          title: '聪ζ',
          href: 'https://github.com/lhccon',
          blankTarget: true,
        },
        {
          key: 'shortDog',
          title: (
            <>
              <GithubOutlined /> wanwu产物-微狗源码
            </>
          ),
          href: 'https://github.com/lhccong/short-link-dog-backend',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
