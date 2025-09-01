
const fs = require("fs");
const path = require("path");

const BASE_DIR = path.resolve("src/i18n");
const OUTPUT = path.resolve("src/i18n/resources.ts");

function pascalCase(str: string) {
  return str
    .replace(/(^\w|-\w)/g, (s) => s.replace("-", "").toUpperCase())
    .replace(/\s+/g, "");
}

// ищем языковые папки (en, ru, zh, ...)
function getLangs(): string[] {
  return fs
    .readdirSync(BASE_DIR, { withFileTypes: true })
    .filter((d: any) => d.isDirectory() && d.name !== "@types")
    .map((d: any) => d.name);
}

function toVarName(file: string, group: string, lang: string) {
  const base = file
    .replace(/\.json$/, "")
    .replace(/[^a-zA-Z0-9]/g, " ")       // заменим дефисы и др. символы на пробелы
    .split(" ")
    .filter(Boolean)
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()
    )
    .join("");

  return `${base}${pascalCase(group)}${pascalCase(lang)}`;
}

function collectImports(lang: string, dir: string, group: string) {
  const absDir = path.join(BASE_DIR, lang, dir);
  if (!fs.existsSync(absDir)) return { imports: [], mapping: {} };

  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  const imports: string[] = [];
  const mapping: Record<string, string> = {};

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".json")) {
      const key = entry.name.replace(/\.json$/, "");
      // const varName = `${key}${pascalCase(group)}${pascalCase(lang)}`;
      const varName = toVarName(entry.name, '', lang);
      const importPath = `./${lang}/${dir}/${entry.name}`;
      imports.push(`import ${varName} from '${importPath}';`);
      mapping[key] = varName;
    }
  }
  return { imports, mapping };
}

function buildLang(lang: string) {
  const imports: string[] = [];
  const mapping: Record<string, any> = {};

  // root json
  for (const file of ["actions", "countries", "errors", "shared"]) {
    const filePath = path.join(BASE_DIR, lang, `${file}.json`);
    if (fs.existsSync(filePath)) {
      const varName = `${file}${pascalCase(lang)}`;
      imports.push(`import ${varName} from './${lang}/${file}.json';`);
      mapping[file] = varName;
    }
  }

  // sections
  for (const section of ["screens", "widgets"]) {
    const { imports: secImports, mapping: secMapping } = collectImports(lang, section, section);
    imports.push(...secImports);
    mapping[section] = secMapping;
  }

  return { imports, mapping };
}

function generate() {
  const langs = getLangs();
  const allImports: string[] = [];
  const allMappings: Record<string, any> = {};

  for (const lang of langs) {
    const { imports, mapping } = buildLang(lang);
    allImports.push(...imports);
    allMappings[lang] = mapping;
  }

  // enum из найденных папок
  const enumCode = `
export enum AppLangEnum {
${langs.map((lang) => `  ${lang.toUpperCase()} = '${lang}',`).join("\n")}
}
`;

  // resources
  const resourcesCode = `
export const resources = {
${langs
  .map(
    (lang) => `  [AppLangEnum.${lang.toUpperCase()}]: {
    ${allMappings[lang].actions ? `actions: ${allMappings[lang].actions},` : ""}
    ${allMappings[lang].countries ? `countries: ${allMappings[lang].countries},` : ""}
    ${allMappings[lang].errors ? `errors: ${allMappings[lang].errors},` : ""}
    ${allMappings[lang].shared ? `shared: ${allMappings[lang].shared},` : ""}
    screens: {
${Object.entries(allMappings[lang].screens || {})
  .map(([k, v]) => `      '${k}': ${v},`)
  .join("\n")}
    },
    widgets: {
${Object.entries(allMappings[lang].widgets || {})
  .map(([k, v]) => `      '${k}': ${v},`)
  .join("\n")}
    },
  },`
  )
  .join("\n")}
} as const;
`;

  const output = `/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
${allImports.join("\n")}

${enumCode}
${resourcesCode}
`;

  fs.writeFileSync(OUTPUT, output, "utf8");
  console.log("✅ Generated:", OUTPUT);
}

generate();
