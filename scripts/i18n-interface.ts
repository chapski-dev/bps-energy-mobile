const fs = require('fs');
const path = require('path');

const LANG_DIR = path.resolve('./src/i18n/ru'); // путь к твоей папке с ru-переводами
const OUTPUT_FILE = path.resolve('./src/i18n/@types/resources.d.ts');

function readJsonRecursive(dirPath: string): any {
  const result: any = {};

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const key = entry.name.replace(/\.json$/, '');

    if (entry.isDirectory()) {
      result[key] = readJsonRecursive(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      result[key] = content;
    }
  }

  return result;
}

function jsonToTsType(obj: any, indent = 2): string {
  const pad = ' '.repeat(indent);
  return (
    '{\n' +
    Object.entries(obj)
      .map(([key, value]) => {
        const safeKey = /^[a-zA-Z_]\w*$/.test(key) ? key : `"${key}"`;
        if (typeof value === 'string') {
          return `${pad}${safeKey}: string;`;
        } else if (typeof value === 'object') {
          return `${pad}${safeKey}: ${jsonToTsType(value, indent + 2)}`;
        }
        return '';
      })
      .join('\n') +
    '\n' +
    ' '.repeat(indent - 2) +
    '}'
  );
}

// Сбор всей структуры
const resources = readJsonRecursive(LANG_DIR);

// Генерация TS
const tsContent = `/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
  interface Resources ${jsonToTsType(resources)};

  export default Resources;
`;

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf-8');
console.log('✅ Types generated at', OUTPUT_FILE);
