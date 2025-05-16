export enum OrderStatusEnum {
	new = 'new',
	pending = 'pending',
	loading = 'loading',
	processing = 'processing',
	unloading = 'unloading'
}


export enum DriverStatusEnum {
  accepted = 'accepted',
  went_to_load = 'went_to_load',
  arrived_for_loading = 'arrived_for_loading',
  finish_loading = 'finish_loading',
  arrived_for_unloading = 'arrived_for_unloading',
  finish_unloading = 'finish_uoloading',
}