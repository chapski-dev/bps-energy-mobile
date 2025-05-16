import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { acceptDriverOrder, rejectDriverOrder } from '@src/api';
import { OrderDetails, TransportationStatusEnum } from '@src/api/types';
// import geolocationService from '@src/service/geolocation-service';
import ordersService from '@src/service/orders';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button } from '@src/ui';
import { handleCatchError } from '@src/utils/handleCatchError';

type OrderCardPropsTypes = OrderDetails;

export const AcceptOrDeclineOrderButtons = (props: OrderCardPropsTypes) => {
  const [loadingAccept, setLoadingAccept] = useState(false);
  
  const [loadingDecline, setLoadingDecline] = useState(false);
  const navigation = useNavigation();
  const { t } = useLocalization();
  const handleDecline = async () => {
    try {
      setLoadingDecline(true);
      const orderId = props.transportationMainInfoResponse.id;
      await rejectDriverOrder(orderId);
      ordersService.removeOrder(orderId);
    } catch (error) {
      handleCatchError(error);
    } finally {
      setLoadingDecline(false);
    }
  };

  const handleAccept = async () => {
    try {
      setLoadingAccept(true);
      console.log(props.transportationMainInfoResponse.id);
      
      const updatedOrder = await acceptDriverOrder(props.transportationMainInfoResponse.id);

      ordersService.orders.forEach((order) => {
        if (
          order?.transportationMainInfoResponse?.id !== updatedOrder?.transportationMainInfoResponse?.id
        ) {
          ordersService.removeOrder(order?.transportationMainInfoResponse?.id);
        }
      });

      ordersService.updateOrder(updatedOrder);
      // await geolocationService.start();
      navigation.navigate('order-action-success', {
        action: 'accept',
        order_number: updatedOrder?.transportationMainInfoResponse?.id
      });
    } catch (error) {
      handleCatchError(error);
    } finally {
      setLoadingAccept(false);
    }
  };

  if (
    props.transportationMainInfoResponse.status ===
    TransportationStatusEnum.WAITING_DRIVER_CONFIRMATION
  ) {
    return (
      <Box row w="full" gap={20} flexGrow={1}>
        <Button
          disabled={loadingAccept || loadingDecline}
          loading={loadingDecline}
          children={t('decline')}
          backgroundColor="red"
          wrapperStyle={{ flex: 1 }}
          onPress={handleDecline}
        />

        <Button
          disabled={loadingAccept || loadingDecline}
          loading={loadingAccept}
          children={t('accept')}
          backgroundColor="green"
          wrapperStyle={{ flex: 1 }}
          onPress={handleAccept}
        />
      </Box>
    );
  }
  return null
};
