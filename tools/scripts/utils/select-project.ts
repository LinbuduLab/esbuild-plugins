import jsonfile from 'jsonfile';
import fs from 'fs-extra';
import enquirer from 'enquirer';
import path from 'path';
import { readPackagesWithVersion } from './read-packages';
import uniq from 'lodash/uniq';

export const selectScope = async (
  extraScopes: string[] = [],
  message?: string | null
) => {
  const packagesInfo = readPackagesWithVersion();
  const availableScopes = uniq(
    packagesInfo.map((pkg) => pkg.project.split('-plugin-')[0])
  );
  const { scopes }: Record<'scopes', string[]> = await enquirer.prompt({
    type: 'multiselect',
    name: 'scopes',
    message: message ?? 'Select scopes',
    choices: availableScopes.concat(extraScopes, 'all'),
  });

  return scopes;
};

export const selectSingleProject = async (
  extraProjects: string[] = [],
  message?: string | null,
  scopes?: string[] | null
) => {
  const packagesInfo = readPackagesWithVersion();
  const allPackages = packagesInfo.map((pkg) => pkg.project);
  const scopePackages =
    scopes.includes('all') || !scopes
      ? allPackages
      : allPackages.filter((pkg) =>
          scopes.some((scope) => pkg.startsWith(scope))
        );

  const { project }: Record<'project', string> = await enquirer.prompt({
    type: 'select',
    name: 'project',
    message: message ?? 'Select a project',
    choices: scopePackages.concat(extraProjects),
  });

  return project;
};

export const selectMultiProjects = async (
  extraProjects: string[] = [],
  message?: string | null,
  scopes?: string[] | null
) => {
  const packagesInfo = readPackagesWithVersion();
  const allPackages = packagesInfo.map((pkg) => pkg.project);
  const scopePackages =
    scopes.includes('all') || !scopes
      ? allPackages
      : allPackages.filter((pkg) =>
          scopes.some((scope) => pkg.startsWith(scope))
        );

  const { projects }: Record<'projects', string[]> = await enquirer.prompt({
    type: 'multiselect',
    name: 'projects',
    message: message ?? 'Select projects',
    choices: scopePackages.concat(extraProjects),
  });

  return projects;
};
