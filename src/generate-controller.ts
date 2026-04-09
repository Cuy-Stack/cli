import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

import {
  type ControllerTemplateType,
  fileExists,
  generateFile,
  isPascalCase,
  normalizeControllerTemplate,
  outputSuccess,
  promptPascalCaseName,
  promptControllerTemplate,
  toKebabCase,
} from './utils/generate-file.ts';

const CONTROLLER_TEMPLATE = `import type { NextFunction, Request, Response } from 'express';

import { Controller, Get } from '@/utils/decorator';

@Controller('/{{name}}')
export class {{namePascalCase}}Controller {
  @Get('')
  async index(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        message: '{{namePascalCase}} endpoint successfuly',
      });
    } catch (error) {
      next(error);
    }
  }
}
`;

const CONTROLLER_CRUD_TEMPLATE = `import type { NextFunction, Request, Response } from 'express';

import { Controller, Get, Post, Put, Delete } from '@/utils/decorator';

@Controller('/{{name}}')
export class {{namePascalCase}}Controller {
  @Get('')
  async index(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        message: '{{namePascalCase}} GET endpoint successfuly',
      });
    } catch (error) {
      next(error);
    }
  }

  @Get(':id')
  async show(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        message: '{{namePascalCase}} GET by ID endpoint successfuly',
      });
    } catch (error) {
      next(error);
    }
  }

  @Post('')
  async create(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        message: '{{namePascalCase}} POST endpoint successfuly',
      });
    } catch (error) {
      next(error);
    }
  }

  @Put(':id')
  async update(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        message: '{{namePascalCase}} PUT endpoint successfuly',
      });
    } catch (error) {
      next(error);
    }
  }

  @Delete(':id')
  async delete(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        message: '{{namePascalCase}} DELETE endpoint successfuly',
      });
    } catch (error) {
      next(error);
    }
  }
}
`;

const resolveTemplate = async (templateArg?: string) => {
  const normalizedTemplate = normalizeControllerTemplate(templateArg);

  if (templateArg && !normalizedTemplate) {
    throw new Error('Template harus `basic` atau `crud`.');
  }

  return normalizedTemplate ?? (await promptControllerTemplate());
};

const getTemplateContent = (templateType: ControllerTemplateType) => {
  if (templateType === 'crud') {
    return CONTROLLER_CRUD_TEMPLATE;
  }

  return CONTROLLER_TEMPLATE;
};

export const generateController = async (
  nameArg?: string,
  templateArg?: string,
) => {
  const rawName =
    nameArg?.trim() ||
    (await promptPascalCaseName('Controller name (PascalCase):'));
  const templateType = await resolveTemplate(templateArg);

  if (!rawName) {
    throw new Error('Controller name is required.');
  }

  if (!isPascalCase(rawName)) {
    throw new Error(
      'Controller name must be PascalCase, for example: UserProfile',
    );
  }

  const namePascalCase = rawName;
  const name = toKebabCase(namePascalCase);

  const controllersDir = join(process.cwd(), 'src/controllers');
  await mkdir(controllersDir, { recursive: true });

  const fileName = `${name}.controller.ts`;
  const filePath = join(controllersDir, fileName);

  if (await fileExists(filePath)) {
    throw new Error(`Controller already exists: src/controllers/${fileName}`);
  }

  const content = generateFile(getTemplateContent(templateType), {
    name,
    namePascalCase,
  });

  await writeFile(filePath, content, 'utf8');
  outputSuccess(`Controller generated: src/controllers/${fileName}`);
};
