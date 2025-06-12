
import countriesRu from './countries.json';
import errorsRu from './errors.json';
import ruTranslation from './ru.json';
import sharedRu from './shared.json';

const common = {
  ...countriesRu,
  ...errorsRu,
  ...ruTranslation,
  ...sharedRu,
}

export default common;