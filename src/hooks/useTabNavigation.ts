import { CommonActions, useNavigation } from '@react-navigation/native';

import { RootStackParamList, TabsParamList } from '@src/navigation/types';

type TabRoutes = keyof TabsParamList;
type StackRoutes = keyof RootStackParamList;

export const useTabNavigation = () => {
  const navigation = useNavigation();
  const navigateToTab = <T extends TabRoutes>(
    tabName: T,
    params?: TabsParamList[T]
  ) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'tabs',
            params: {
              params,
              screen: tabName,
            },
          },
        ],
      })
    );
  };

  /** Метод для навигации к экрану через конкретный таб */
  const navigateToScreenViaTab = <
    T extends TabRoutes,
    S extends StackRoutes
  >(
    tabName: T,
    screenName: S,
    screenParams?: RootStackParamList[S],
    tabParams?: TabsParamList[T]
  ) => {
    // Сначала переходим к нужному табу
    navigateToTab(tabName, tabParams);

    // Затем навигируемся к экрану
    setTimeout(() => {
      navigation.navigate(screenName, screenParams);
    }, 0);
  };

  // Альтернативный метод с reset для более надежной навигации
  const resetToScreenViaTab = <
    T extends TabRoutes,
    S extends StackRoutes
  >(
    tabName: T,
    screenName: S,
    screenParams?: RootStackParamList[S],
    tabParams?: TabsParamList[T]
  ) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1, // Два экрана в стеке: tabs и целевой экран
        routes: [
          {
            name: 'tabs',
            params: {
              params: tabParams,
              screen: tabName,
            },
          },
          {
            name: screenName,
            params: screenParams,
          },
        ],
      })
    );
  };

  // Удобные методы для навигации к экранам через конкретные табы
  const goToProfileDetails = () =>
    navigateToScreenViaTab('profile', 'profile-details');

  const goToChargingHistory = () =>
    navigateToScreenViaTab('profile', 'charging-history');


  return {
    goToChargingHistory,
    goToProfileDetails,
    navigateToScreenViaTab,
    navigateToTab,
    resetToScreenViaTab,
  } as const;
};