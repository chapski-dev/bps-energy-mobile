import { EventBus } from '@trutoo/event-bus';

import { getDriverOrders, getDriverOrdersFinished } from '@src/api';
import { ComplitedOrderDetails, OrderDetails } from '@src/api/types';
import { EventBusEvents } from '@src/events';
import { handleCatchError } from '@src/utils/handleCatchError';

export type OrdersFetchingType = 'complited' | 'active' | 'all';
class OrdersService extends EventBus {
  orders: OrderDetails[] = [];
  complited_orders: ComplitedOrderDetails[] = [];

  loading = false;
  loading_more = false;
  has_more = false;
  next_page = 0;
  limit = 10;

  constructor() {
    super();
    this.register(EventBusEvents.getOrders, { type: 'array' });
    this.register(EventBusEvents.getComplitedOrders, { type: 'array' });
    this.register(EventBusEvents.setOrderLoading, { type: 'boolean' });
  }

  refresh = async (type: OrdersFetchingType) => {
    try {
      this.limit = 10;
      this.next_page = 0; // Сбрасываем страницу
      this.loading = true;
      this.publish(EventBusEvents.setOrderLoading, this.loading);
      this.deleteAll(type);
      await this.fetch(type);
    } catch (e) {
      this.orders = [];
      this.complited_orders = [];
      handleCatchError(e, 'Orders service refresh');
    } finally {
      this.loading = false;
      this.publish(EventBusEvents.setOrderLoading, this.loading);
      this.update();
    }
  };

  fetch = async (type: OrdersFetchingType) => {
    switch (type) {
      case 'complited': {
        const finished = await getDriverOrdersFinished();
        this.complited_orders = [...this.complited_orders, ...finished.content];
        break;
      }
      case 'active': {
        const notFinished = await getDriverOrders();
        this.orders = [...this.orders, ...notFinished.content];
        break;
      }
      default: {
        const finished = await getDriverOrdersFinished();
        this.complited_orders = [...this.complited_orders, ...finished.content];
        const notFinished = await getDriverOrders();
        this.orders = [...this.orders, ...notFinished.content];
      }
    }
  };

  loadMore = async (type: OrdersFetchingType) => {
    if (!this.has_more || this.loading_more) {
      return;
    }
    try {
      this.loading_more = true;
      await this.fetch(type);
      this.update();
    } catch (error) {
      console.error('orders loadMore error: ', error);
    } finally {
      this.loading_more = false;
    }
  };

  update = () => {
    this.publish(EventBusEvents.getOrders, this.orders);
    this.publish(EventBusEvents.getComplitedOrders, this.complited_orders);
  };

  deleteAll = (type: OrdersFetchingType) => {
    switch (type) {
      case 'complited': {
        this.complited_orders = [];
        this.publish(EventBusEvents.getComplitedOrders, this.complited_orders);
        break;
      }
      case 'active': {
        this.orders = [];
        this.publish(EventBusEvents.getOrders, this.orders);
        break;
      }
      default: {
        this.orders = [];
        this.complited_orders = [];
        this.publish(EventBusEvents.getOrders, this.orders);
        this.publish(EventBusEvents.getComplitedOrders, this.complited_orders);
      }
    }
  };

  updateOrder = (updatedOrder: OrderDetails) => {
    const index = this.orders.findIndex(
      (o) => o.transportationMainInfoResponse.id === updatedOrder.transportationMainInfoResponse.id
    );

    if (index !== -1) {
      this.orders[index] = updatedOrder;
      this.publish(EventBusEvents.getOrders, this.orders);
    }
  };

  removeOrder = (orderId: number) => {
    this.orders = this.orders.filter((o) => o.transportationMainInfoResponse.id !== orderId);
    this.publish(EventBusEvents.getOrders, this.orders);
  };
}

export default new OrdersService();
