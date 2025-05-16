import React from 'react'

import { Box, Text } from '@src/ui'

const SosModal = () => {
  return (
    <Box backgroundColor='#fff' py={85} borderRadius={10} gap={4} px={30} >
      <Text center type='h2' children="Сигнал SOS отправлен!" />
      <Text
        center
        style={{ lineHeight: 22 }}
        children="Сигнал отправлен кординатору маршрута и заказчику перевозки, в ближайшее время с вами свяжутся."
      />
    </Box>
  )
}

export default SosModal