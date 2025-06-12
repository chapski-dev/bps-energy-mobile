
import countriesRu from './countries.json';
import ruTranslation from './en.json';
import errorsRu from './errors.json';
import sharedRu from './shared.json';

const common = {
  ...countriesRu,
  ...errorsRu,
  ...ruTranslation,
  ...sharedRu,
}

export default common;