import { constants as fsConstants } from 'fs';
import { access } from 'fs/promises';

import { cancel, isCancel, log, select, text } from '@clack/prompts';
import chalk from 'chalk';

export type ControllerTemplateType = 'basic' | 'crud';

const clearAndUpper = (text: string) => {
  return text.replace(/-/, '').toUpperCase();
};

export const toPascalCase = (str: string) => {
  return str.replace(/(^\w|-\w)/g, clearAndUpper).replace(/-/g, '');
};

export const toKebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

export const generateFile = (
  template: string,
  data: Record<string, string>,
) => {
  let result = template;
  for (const key in data) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, data[key] ?? '');
  }
  return result;
};

export const isPascalCase = (value: string) =>
  /^[A-Z][A-Za-z0-9]*$/.test(value);

export const promptPascalCaseName = async (message: string) => {
  const answer = await text({
    message: chalk.cyan(message),
    placeholder: 'UserProfile',
    validate(value) {
      const trimmedValue = (value ?? '').trim();

      if (!trimmedValue) {
        return 'Controller name is required.';
      }

      if (!isPascalCase(trimmedValue)) {
        return 'Controller name must be PascalCase, for example: UserProfile';
      }

      return;
    },
  });

  if (isCancel(answer)) {
    cancel(chalk.yellow('Operation cancelled.'));
    process.exit(0);
  }

  return answer.trim();
};

export const fileExists = async (path: string) => {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
};

export const outputSuccess = (message: string) => {
  log.success(chalk.green(message));
};

export const outputError = (message: string) => {
  log.error(chalk.red(message));
};

export const normalizeControllerTemplate = (
  value?: string,
): ControllerTemplateType | null => {
  const normalizedValue = value?.trim().toLowerCase();

  if (!normalizedValue) {
    return null;
  }

  if (normalizedValue === 'basic' || normalizedValue === 'normal') {
    return 'basic';
  }

  if (normalizedValue === 'crud') {
    return 'crud';
  }

  return null;
};

export const promptControllerTemplate = async () => {
  const answer = await select<ControllerTemplateType>({
    message: chalk.cyan('Pilih template controller:'),
    options: [
      { value: 'basic', label: 'Basic', hint: 'Endpoint index saja' },
      { value: 'crud', label: 'CRUD', hint: 'GET, POST, PUT, DELETE' },
    ],
    initialValue: 'basic',
  });

  if (isCancel(answer)) {
    cancel(chalk.yellow('Operation cancelled.'));
    process.exit(0);
  }

  return answer;
};
