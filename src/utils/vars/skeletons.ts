import { ICustomViewStyle } from 'react-native-reanimated-skeleton/lib/typescript/constants'

export const chargingsSkeletonLayout: ICustomViewStyle[] = [
  {
    children: [
      {
        borderRadius: 8,
        height: 64,
        width: 64,
      },
      {
        children: [
          {
            children: [
              { height: 22, width: 120 },
              { height: 20, width: 150 },
            ],
            flexDirection: 'column',
            gap: 4,
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      { height: 20, width: 62 },
                      { height: 25, width: 82 },
                    ],
                    flexDirection: 'column',
                    gap: 4,
                  },
                  {
                    children: [
                      { height: 20, width: 62 },
                      { height: 25, width: 82 },
                    ],
                    flexDirection: 'column',
                    gap: 4,
                  }
                ],
                flexDirection: 'row',
                gap: 32,
              }
            ],
            flexDirection: 'column',
            gap: 4,
          },
        ],
        flexDirection: 'column',
        gap: 16,
        justifyContent: 'space-between',
      },
    ],
    flexDirection: 'row',
    gap: 16,
    padding: 16
  },
]

export const rechargingsSkeletonLayout: ICustomViewStyle[] = [
  {
    children: [
      {
        borderRadius: 24,
        height: 24,
        width: 24,
      },
      {
        children: [
          { height: 22, width: 106 },
          { height: 20, width: 76 },
        ],
        flexDirection: 'column',
        gap: 4,
      },
    ],
    flexDirection: 'row',
    gap: 16,
    padding: 16
  },
]