### Creating an NX Schematic for Vitest and React Testing Library Configuration

## Step 1: Generate the Schematic

First, let's create the generator using the NX CLI:

```shellscript
npx nx generate @nx/plugin:generator vitest-rtl-setup --directory=tools/generators
```

## Step 2: Define the Schema

Let's update the schema to accept the necessary options:

```typescriptreact
{
  "$schema": "http://json-schema.org/schema",
  "cli": "nx",
  "$id": "vitest-rtl-setup",
  "title": "Configure Vitest and React Testing Library",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The name of the library to create or update",
      "$default": {
        "$source": "argv",
        "index": 0
      },
      "x-prompt": "What is the name of the library you want to create or configure?"
    },
    "directory": {
      "type": "string",
      "description": "Directory where the library will be created",
      "x-prompt": "In which directory should the library be created? (Leave empty for root)"
    },
    "tags": {
      "type": "string",
      "description": "Add tags to the library (comma-separated)",
      "x-prompt": "Add tags to the library (comma-separated)"
    }
  },
  "required": ["name"]
}
```

## Step 3: Implement the Generator

Now, let's implement the generator logic:

```typescriptreact
import {
  formatFiles,
  generateFiles,
  getProjects,
  installPackagesTask,
  names,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import * as path from 'path';
import { VitestRtlSetupGeneratorSchema } from './schema';

interface NormalizedSchema extends VitestRtlSetupGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: VitestRtlSetupGeneratorSchema
): NormalizedSchema {
  const projectName = names(options.name).fileName;
  const directory = options.directory ? `${names(options.directory).fileName}` : '';
  const projectDirectory = directory ? `${directory}/${projectName}` : projectName;
  const projectRoot = `libs/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function libraryExists(tree: Tree, projectName: string): boolean {
  const projects = getProjects(tree);
  return projects.has(projectName);
}

function createLibrary(tree: Tree, options: NormalizedSchema) {
  // We'll use the NX React library generator
  const { execSync } = require('child_process');
  
  const directoryFlag = options.directory ? `--directory=${options.directory}` : '';
  const tagsFlag = options.parsedTags.length > 0 ? `--tags=${options.parsedTags.join(',')}` : '';
  
  execSync(
    `npx nx g @nx/react:library ${options.name} ${directoryFlag} ${tagsFlag} --no-interactive`,
    { stdio: 'inherit' }
  );
}

function configureVitestAndRTL(tree: Tree, options: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(tree, options.projectName);
  
  // Generate Vitest configuration files
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    {
      ...options,
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      template: '',
    }
  );

  // Update project configuration to use Vitest
  projectConfig.targets = projectConfig.targets || {};
  projectConfig.targets.test = {
    executor: '@nx/vite:test',
    outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
    options: {
      passWithNoTests: true,
      reportsDirectory: '../../coverage/{projectRoot}',
    },
  };

  updateProjectConfiguration(tree, options.projectName, projectConfig);
}

export default async function (tree: Tree, options: VitestRtlSetupGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const exists = libraryExists(tree, normalizedOptions.projectName);

  if (!exists) {
    // Create the library if it doesn't exist
    createLibrary(tree, normalizedOptions);
  }

  // Configure Vitest and RTL for the library
  configureVitestAndRTL(tree, normalizedOptions);

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}
```

## Step 4: Create the Schema TypeScript Interface

```typescriptreact
export interface VitestRtlSetupGeneratorSchema {
  name: string;
  directory?: string;
  tags?: string;
}
```

## Step 5: Create Template Files

Now, let's create the template files for Vitest configuration:

```typescriptreact
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { join } from 'path';

export default defineConfig({
  plugins: [
    react(),
    viteTsConfigPaths({
      root: '<%= offsetFromRoot %>',
    }),
  ],
  test: {
    globals: true,
    cache: {
      dir: '<%= offsetFromRoot %>node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./src/test-setup.ts'],
  },
});
```

```typescriptreact
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});
```

```typescriptreact
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

export * from '@testing-library/react';
export { customRender as render };
```

```typescriptreact
import { render, screen } from '../test-utils';
import { describe, it, expect } from 'vitest';

describe('Example test', () => {
  it('renders successfully', () => {
    render(<div>Test Component</div>);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });
});
```

## Usage

Once you've created this generator, you can use it with:

```shellscript
npx nx generate vitest-rtl-setup my-library --directory=feature
```

This will either:

1. Create a new React library named `my-library` in the `libs/feature` directory and configure it with Vitest and RTL, or
2. Configure an existing `my-library` to use Vitest and RTL if it already exists


## How It Works

1. The generator checks if the specified library exists
2. If not, it creates a new React library using NX's built-in generator
3. It then adds Vitest configuration files to the library
4. It updates the project configuration to use Vitest for testing
5. It adds test utility files and an example test to help get started


This approach follows NX best practices and ensures that your libraries are properly configured for testing with Vitest and React Testing Library.

## What Happens When the Library Already Exists

If the library already exists, the generator will:

1. Skip the library creation step
2. Configure the existing library to use Vitest and React Testing Library by:

1. Adding the Vitest configuration file (`vitest.config.ts`)
2. Adding the test setup file (`src/test-setup.ts`)
3. Adding testing utilities (`src/lib/test-utils.tsx`)
4. Adding an example test file (`src/lib/__tests__/example.spec.tsx`)
5. Updating the project configuration in `project.json` to use Vitest as the test executor





Here's the specific part of the generator that handles this logic:

```typescript
export default async function (tree: Tree, options: VitestRtlSetupGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const exists = libraryExists(tree, normalizedOptions.projectName);

  if (!exists) {
    // Create the library if it doesn't exist
    createLibrary(tree, normalizedOptions);
  }

  // Configure Vitest and RTL for the library (this runs regardless of whether the library exists)
  configureVitestAndRTL(tree, normalizedOptions);

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}
```

The `configureVitestAndRTL` function is called regardless of whether the library exists or not. This function:

1. Reads the current project configuration
2. Generates the Vitest configuration files
3. Updates the project's test target to use Vitest instead of whatever was there before


This approach ensures that your existing library is properly configured for testing with Vitest and React Testing Library without recreating or modifying any of your existing components or business logic.

If you want to be extra cautious with existing libraries, you could add a confirmation prompt before modifying an existing library, but the current implementation will safely add the testing configuration without disrupting your existing code.


### Adding a Confirmation Prompt for Existing Libraries

Let's update the generator to add a confirmation prompt before modifying an existing library. Here's how to implement this:

## Step 1: Update the Schema

First, let's update the schema to include a confirmation option:

```typescriptreact
{
  "$schema": "http://json-schema.org/schema",
  "cli": "nx",
  "$id": "vitest-rtl-setup",
  "title": "Configure Vitest and React Testing Library",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The name of the library to create or update",
      "$default": {
        "$source": "argv",
        "index": 0
      },
      "x-prompt": "What is the name of the library you want to create or configure?"
    },
    "directory": {
      "type": "string",
      "description": "Directory where the library will be created",
      "x-prompt": "In which directory should the library be created? (Leave empty for root)"
    },
    "tags": {
      "type": "string",
      "description": "Add tags to the library (comma-separated)",
      "x-prompt": "Add tags to the library (comma-separated)"
    },
    "force": {
      "type": "boolean",
      "description": "Force overwrite of existing test configuration",
      "default": false
    }
  },
  "required": ["name"]
}
```

## Step 2: Update the Schema Interface

```typescriptreact
export interface VitestRtlSetupGeneratorSchema {
  name: string;
  directory?: string;
  tags?: string;
  force?: boolean;
}
```

## Step 3: Modify the Generator to Include the Confirmation Prompt

```typescriptreact
import {
  formatFiles,
  generateFiles,
  getProjects,
  installPackagesTask,
  names,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
  logger,
} from '@nx/devkit';
import * as path from 'path';
import { VitestRtlSetupGeneratorSchema } from './schema';
import { prompt } from 'enquirer';

interface NormalizedSchema extends VitestRtlSetupGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: VitestRtlSetupGeneratorSchema
): NormalizedSchema {
  const projectName = names(options.name).fileName;
  const directory = options.directory ? `${names(options.directory).fileName}` : '';
  const projectDirectory = directory ? `${directory}/${projectName}` : projectName;
  const projectRoot = `libs/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function libraryExists(tree: Tree, projectName: string): boolean {
  const projects = getProjects(tree);
  return projects.has(projectName);
}

function createLibrary(tree: Tree, options: NormalizedSchema) {
  // We'll use the NX React library generator
  const { execSync } = require('child_process');
  
  const directoryFlag = options.directory ? `--directory=${options.directory}` : '';
  const tagsFlag = options.parsedTags.length > 0 ? `--tags=${options.parsedTags.join(',')}` : '';
  
  execSync(
    `npx nx g @nx/react:library ${options.name} ${directoryFlag} ${tagsFlag} --no-interactive`,
    { stdio: 'inherit' }
  );
}

function configureVitestAndRTL(tree: Tree, options: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(tree, options.projectName);
  
  // Generate Vitest configuration files
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    {
      ...options,
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      template: '',
    }
  );

  // Update project configuration to use Vitest
  projectConfig.targets = projectConfig.targets || {};
  projectConfig.targets.test = {
    executor: '@nx/vite:test',
    outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
    options: {
      passWithNoTests: true,
      reportsDirectory: '../../coverage/{projectRoot}',
    },
  };

  updateProjectConfiguration(tree, options.projectName, projectConfig);
}

async function confirmModification(projectName: string): Promise<boolean> {
  try {
    const { proceed } = await prompt<{ proceed: boolean }>({
      type: 'confirm',
      name: 'proceed',
      message: `Library '${projectName}' already exists. Do you want to configure it with Vitest and React Testing Library? This will overwrite any existing test configuration.`,
      initial: false
    });
    return proceed;
  } catch (error) {
    // If prompt fails (e.g., in a non-interactive environment), return false
    return false;
  }
}

export default async function (tree: Tree, options: VitestRtlSetupGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const exists = libraryExists(tree, normalizedOptions.projectName);

  if (!exists) {
    // Create the library if it doesn't exist
    logger.info(`Creating new library: ${normalizedOptions.projectName}`);
    createLibrary(tree, normalizedOptions);
  } else {
    // If the library exists and force option is not set, ask for confirmation
    if (!options.force) {
      const shouldProceed = await confirmModification(normalizedOptions.projectName);
      if (!shouldProceed) {
        logger.info('Operation cancelled. No changes were made.');
        return () => {}; // Return early with no-op
      }
    }
    logger.info(`Configuring existing library: ${normalizedOptions.projectName}`);
  }

  // Configure Vitest and RTL for the library
  configureVitestAndRTL(tree, normalizedOptions);

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}
```

## Step 4: Install Required Dependencies

You'll need to add the `enquirer` package for the interactive prompts:

```shellscript
npm install enquirer --save-dev
```

## Usage with the Confirmation Prompt

Now when you run the generator and the library already exists, you'll get a confirmation prompt:

```shellscript
npx nx generate vitest-rtl-setup my-library
```

If the library exists, you'll see:

```plaintext
Library 'my-library' already exists. Do you want to configure it with Vitest and React Testing Library? This will overwrite any existing test configuration. (y/n)
```

You can also bypass the confirmation with the `--force` flag:

```shellscript
npx nx generate vitest-rtl-setup my-library --force
```

## How It Works

1. The generator checks if the library exists
2. If it exists and the `--force` flag is not set, it prompts for confirmation
3. If the user confirms or the `--force` flag is set, it proceeds with the configuration
4. If the user declines, the operation is cancelled with no changes made


This approach gives users more control and prevents accidental modification of existing libraries while still providing a streamlined workflow when needed.
