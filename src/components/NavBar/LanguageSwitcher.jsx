import React from 'react';
import { Menu, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES } from '../../i18n';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = SUPPORTED_LANGUAGES.find(({ code }) => code === i18n.language);

  return (
    <Menu shadow="md" position="bottom-end">
      <Menu.Target>
        <Button size="compact-md" color="green">
          {current ? current.label : i18n.language}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {SUPPORTED_LANGUAGES.map(({ code, label }) => (
          <Menu.Item key={code} onClick={() => i18n.changeLanguage(code)}>
            {label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default LanguageSwitcher;
